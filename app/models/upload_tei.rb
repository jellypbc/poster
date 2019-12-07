# == Schema Information
#
# Table name: upload_teis
#
#  id         :bigint           not null, primary key
#  body       :jsonb
#  header     :jsonb
#  references :jsonb
#  upload_id  :integer
#
# Indexes
#
#  index_upload_teis_on_upload_id  (upload_id)
#

class UploadTei < ApplicationRecord
	belongs_to :upload
	has_one :post, through: :upload

	after_create_commit :process

	def process
		GrobidService.call(self)
		DiborgService.call(self, post)
	end

end
