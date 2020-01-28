class DiborgServiceWorker
  include Sidekiq::Worker

  def perform(upload_tei_id, post_id)
  	DiborgService.call(upload_tei_id, post_id)
  end
end
