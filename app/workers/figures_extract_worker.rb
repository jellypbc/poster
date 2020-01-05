class FiguresExtractWorker
  include Sidekiq::Worker

  def perform(upload_id)
  	FiguresExtractService.extract(upload_id)
  end
end