class FiguresInlinerWorker
  include Sidekiq::Worker

  def perform(post_id)
    FiguresInlinerService.call(post_id)
  end
end
