class DiborgServiceWorker
  include Sidekiq::Worker

  def perform(upload_id)
  	DiborgService.call(upload_id)
  end
end
