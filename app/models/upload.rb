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

	has_one :upload_tei, dependent: :destroy
	has_many :upload_images, dependent: :destroy

	accepts_nested_attributes_for :upload_images, allow_destroy: true

	after_create_commit :process

	def process
		create_upload_tei if is_pdf?
		FiguresExtractWorker.perform_async(id)
	end

	def create_upload_tei
		UploadTei.create(upload: self)
	end

	def is_pdf?
		file.metadata["mime_type"].include?("pdf")
	end

	def file_url
		url = file.url
		if Rails.env.development?
			if ENV['FIGURE_HOST']
				"http://rails:3000" + url
			else
				"http://host.docker.internal:3000" + url
			end
		else
			url
		end
	end

end
