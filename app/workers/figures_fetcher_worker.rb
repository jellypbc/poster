class FiguresFetcherWorker
  include Sidekiq::Worker

  FIGURES_HOST = ENV['FIGURE_URL'] || "http://#{ENV['FIGURE_HOST'] || "localhost"}:4567"

  # TODO:
  # error handling for when image.save! fails
  # Fetches figures from external figure server and saves them
  def perform(body, upload_id)
  	# TODO: raise on upload not yet created?
    @upload = Upload.find upload_id
    @upload.upload_figures.destroy_all if @upload.upload_figures.any?

    body.each do |figure|
      figure = @upload.upload_figures.new

      file_path = figure["renderURL"]
      url = FIGURES_HOST + '/' + file_path

      figure.figure_type = figure["figType"]
      figure.caption = figure["caption"]
      figure.page = figure["page"]
      figure.name = figure["name"]
      figure.image_remote_url = url

      figure.save!
    end

    # callback to figures host for /cleanup
    FiguresExtractService.cleanup(@upload.id)

  end
end
