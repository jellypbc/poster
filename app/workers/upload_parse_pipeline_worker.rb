# UploadParsePipelineWorker.call(upload_id)

class UploadParsePipelineWorker
  include Sidekiq::Worker

  # Order of async processing pipeline
  # Each batch runs a Post.update!(body: body)
  def perform(upload_id)
    @upload = Upload.find(upload_id)
    @post = @upload.post
    @upload_tei = @upload.upload_tei

    overall = Sidekiq::Batch.new
    overall.on(:complete, 'PipelineSteps#finished', 'upload_id' => upload_id)
    overall.description = "Parse #{@upload.id}"
    overall.jobs do
      StartPipeline.perform_async(@upload.id)
    end

  end
end

# # [batch]
# # Pings external grobid service
# GrobidServiceWorker.perform_async(id)
# # Pings external figures service
# FiguresExtractWorker.perform_async(id)

# # [batch]
# # Generates citations and parses XML, Post.update!
# DiborgServiceWorker.perform_async(@upload_tei.id, @post.id)

# # [batch]
# # Inlines figures into post body after they are generated, Post.update!
# FiguresInlinerService.call(@upload.post.id)

# # [batch]
# CitationsInlinerService.call(@upload.post.id)

class StartPipeline
  include Sidekiq::Worker
  def perform(upload_id)
    batch.jobs do
      step1 = Sidekiq::Batch.new
      step1.on(:success, 'PipelineSteps#step1_done', 'upload_id' => upload_id)

      step1.jobs do
        # GrobidServiceWorker.perform_async(id)
        # FiguresExtractWorker.perform_async(id)
        GrobidService.call(upload_id)
        FiguresExtractService.extract(upload_id)
      end
    end
  end
end

class PipelineSteps
  def step1_done(status, options)
    upload_id = options['upload_id']
    @upload = Upload.find upload_id

    overall = Sidekiq::Batch.new(status.parent_bid)
    overall.jobs do
      step2 = Sidekiq::Batch.new
      step2.on(:success, 'PipelineSteps#step2_done', 'upload_id' => upload_id)
      step2.jobs do
        # DiborgServiceWorker.perform_async(@upload_tei.id, @post.id)
        DiborgService.call(@upload.upload_tei.id, @upload.post.id)
      end
    end
  end

  def step2_done(status, options)
    upload_id = options['upload_id']
    overall = Sidekiq::Batch.new(status.parent_bid)
    overall.jobs do
      step2 = Sidekiq::Batch.new
      step2.on(:success, 'PipelineSteps#finished', 'upload_id' => upload_id)
      step2.jobs do
        FiguresInlinerService.call(@upload.post.id)
      end
    end
  end


  def finished(status, options)
    upload_id = options['upload_id']
    HardWorker.perform_async("<<<< bid #{status.bid}")
    HardWorker.perform_async("<<<< finished #{status.parent_bid}")
    ActionCable.server.broadcast "posts_channel", content: "<<<<< finished #{upload_id}"
  end
end
