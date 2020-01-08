# class FiguresExtractService
# This service object calls the external figure extractor microservice
# and creates upload_images for the upload, as well as parses out
# the figure information.

class FiguresExtractService

	FIGURES_HOST = ENV['FIGURE_URL'] || "http://#{ENV['FIGURE_HOST'] || "localhost"}:4567"

  def self.extract(*args)
    new(*args).extract
  end

  def self.cleanup(*args)
    new(*args).cleanup
  end

  def initialize(upload_id)
    @upload = Upload.find upload_id
    @file = @upload.file_url
  end

  # External Call
  # /process
  # request params: { :upload_id, :pdf }
  def extract
    return unless @upload
    return unless @upload.is_pdf?
    return unless @file

    endpoint = "process"
    data = {
      body: {
        upload_id: @upload.id.to_s,
        pdf: @file
      }
    }
    resp = fire_away(endpoint, data)

    if resp.code == 200
      body = JSON.parse(resp.body)
      FiguresFetcherWorker.perform_async(body, @upload.id)
    else
      raise resp.body
    end
  end

  # External Call
  # /cleanup/:upload_id
  # request params: { :upload_id }
  def cleanup
    return unless @upload

    endpoint = "cleanup/#{@upload.id}"
    resp = fire_away(endpoint)

    if resp.code == 200
    else
      raise resp
    end
  end

  private

    def fire_away(endpoint, data = {})
      resp = HTTParty.post( image_call(endpoint), data )
    end

    def image_call(endpoint)
      "#{FIGURES_HOST}/#{endpoint}"
    end

end
