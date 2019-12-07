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
	include GrobidParser

	belongs_to :post

	after_create_commit :process

	def process
		processFulltextDocument
		processHeaderDocument
		post.process
	end

end
