# == Schema Information
#
# Table name: uploads
#
#  id         :bigint           not null, primary key
#  file_data  :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :integer
#
# Indexes
#
#  index_uploads_on_post_id  (post_id)
#

class Upload < ApplicationRecord
	include FileUploader::Attachment(:file)

	belongs_to :post

	has_one :upload_tei
	has_many :upload_images

	accepts_nested_attributes_for :upload_images, allow_destroy: true

	after_create_commit :process

	def process
		create_upload_tei if is_pdf?
		ImageExtractService.call(self)
	end

	def create_upload_tei
		UploadTei.create(upload: self)
	end

	def is_pdf?
		file.metadata["mime_type"].include?("pdf")
	end

	def file_url
		url = file.url
		Rails.env.development? ? "./public" + url : url
	end

end
