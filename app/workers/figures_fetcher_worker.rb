class FiguresFetcherWorker
  include Sidekiq::Worker

  FIGURES_HOST = ENV['FIGURE_URL'] || "http://localhost:4567"

  # TODO:
  # error handling for when image.save! fails

	# Fetches figures from external figure server and saves them
  def perform(body, upload_id)
  	@upload = Upload.find upload_id
    @upload.upload_images.destroy_all if @upload.upload_images.any?

    body.each do |figure|
    	upload_image = @upload.upload_images.new

      file_path = figure["renderURL"]
    	url = FIGURES_HOST + '/' + file_path

      upload_image.type = figure["figType"]
      upload_image.caption = figure["caption"]
      upload_image.page = figure["page"]
      upload_image.name = figure["name"]
    	upload_image.image_remote_url = url

      upload_image.save!
    end

    # callback to figures host for /cleanup
    FiguresExtractService.cleanup(@upload.id)

  end
end