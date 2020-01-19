class GrobidServiceWorker
  include Sidekiq::Worker

  def perform(upload_id)
  	GrobidService.call(upload_id)
  end
end
