# == Schema Information
#
# Table name: uploads
#
#  id         :bigint           not null, primary key
#  file_data  :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :integer
#  user_id    :integer
#
# Indexes
#
#  index_uploads_on_post_id  (post_id)
#  index_uploads_on_user_id  (user_id)
#

class Upload < ApplicationRecord
	include FileUploader::Attachment(:file)

	belongs_to :post, optional: true
  belongs_to :user, optional: true

	has_one :upload_tei, dependent: :destroy
	has_many :upload_figures, dependent: :destroy

	accepts_nested_attributes_for :upload_figures, allow_destroy: true

	validates_presence_of :file

	after_create_commit :process

	def process
    if is_pdf?
      create_upload_tei
      UploadParsePipelineWorker.perform_async(id)
    end
	end

	def is_pdf?
		file.metadata["mime_type"].include?("pdf")
	end

	def file_url
		url = file.url
		if Rails.env.development?
			if ENV['FIGURE_HOST']
				"http://host.docker.internal:3000" + url
			else
				"http://rails:3000" + url
				# "http://host.docker.internal: 	3000" + url
			end
		else
			url
		end
	end

end
