class UploadParsePipelineWorker
  include Sidekiq::Worker

  def perform(upload_id)
    if Rails.configuration.x.grobid_host && Rails.configuration.x.figure_host
      overall = Sidekiq::Batch.new
      overall.description = "Parse #{upload_id}"
      overall.jobs do
        StartPipeline.perform_async(upload_id)
      end
    end
  end
end

class StartPipeline
  include Sidekiq::Worker

  # step 1: run grobid and figures external services
  def perform(upload_id)
    batch.jobs do
      step1 = Sidekiq::Batch.new
      step1.on(:success, 'PipelineSteps#step2', 'upload_id' => upload_id)
      step1.jobs do
        FiguresExtractWorker.perform_async(upload_id)
        GrobidServiceWorker.perform_async(upload_id)
      end
    end
  end
end

class PipelineSteps

  # step 2: run diborg
  # Post.update!(body: body)
  def step2(status, options)
    upload_id = options['upload_id']
    overall = Sidekiq::Batch.new(status.parent_bid)
    overall.jobs do
      step = Sidekiq::Batch.new
      step.on(:success, 'PipelineSteps#step3', 'upload_id' => upload_id)
      step.jobs do
        DiborgServiceWorker.perform_async(upload_id)
      end
    end
  end

  # step 3: run figure inliner service
  def step3(status, options)
    upload_id = options['upload_id']
    @upload = Upload.find(upload_id)
    post_id = @upload.post.id

    overall = Sidekiq::Batch.new(status.parent_bid)
    overall.jobs do
      step = Sidekiq::Batch.new
      step.on(:success, 'PipelineSteps#finished', 'post_id' => post_id)
      step.jobs do
        FiguresInlinerWorker.perform_async(@upload.post.id)
      end
    end

  end

  # step 4: send websocket response
  def finished(status, options)
    BroadcastPostsChannelWorker.perform_async(options['post_id'])
  end
end
