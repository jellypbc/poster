class ImageExtractService
  require 'hexapdf'

  def self.call(*args)
    new(*args).call
  end

  def initialize(upload)
    @upload = upload
    @file = File.open(open(@upload.file_url))
  end

  # called in a ImageUploadWorker?
  def call
    return unless @upload.is_pdf?
    return unless @file

    run
  end

  private

    def run
      doc = HexaPDF::Document.new(io: @file)

      doc.images.each_with_index do |image, index|
        info = image.info
        # filename = "tmp/#{@upload.id}-#{index}.#{info.extension}"

        filename = "#{@upload.id}-#{index}.#{info.extension}"

        # write image
        # image.write(filename, Rails.root.join('tmp')) if info.writeable
        image.write(filename) if info.writable

        # potentially unsecure
        i = File.open(filename)

        # i = File.open(filename, "wb") do |file|
        #   file.write(image.stream)
        # end

        # create upload_image
        UploadImage.create!(image: i, upload: @upload)

        # upload to shrine

        # determine the order of the figures top down based on figure coords

        # inject post.body with images

        File.delete(filename)
      end
    end
end
