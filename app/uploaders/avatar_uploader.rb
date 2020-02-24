require "image_processing/mini_magick"

class AvatarUploader < Shrine

  # resizes to small, medium, and large
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)

    {
      small:  magick.resize_to_limit!(78, 78),
      medium: magick.resize_to_limit!(300, 300),
      large:  magick.resize_to_limit!(500, 500),
    }
  end

  # fallback to original if no derivatives
  Attacher.default_url do |derivative: nil, **|
    file&.url if derivative
  end

  Attacher.validate do
    validate_size      1..10*1024*1024
    validate_mime_type %w[image/jpeg image/png image/webp image/tiff image/gif]
    validate_extension %w[jpg jpeg png webp tiff tif gif]
  end
end
