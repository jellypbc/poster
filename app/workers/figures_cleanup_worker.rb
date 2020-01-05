class FiguresCleanupWorker
  include Sidekiq::Worker

  def perform(upload_id)
    FiguresExtractService.call(upload_id)
  end
end