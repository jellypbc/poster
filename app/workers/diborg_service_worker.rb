class DiborgServiceWorker
  include Sidekiq::Worker

  def perform(upload_id, post_id)
  	DiborgService.call(upload_id, post_id)
  end
end
