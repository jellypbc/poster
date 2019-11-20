# == Schema Information
#
# Table name: uploads
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  file_data  :text
#  post_id    :integer
#

class Upload < ApplicationRecord
	include FileUploader::Attachment(:file)
	include GrobidParser

	belongs_to :post

end
