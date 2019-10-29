# == Schema Information
#
# Table name: uploads
#
#  id         :integer          not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  file_data  :text
#

class Upload < ApplicationRecord
	include FileUploader::Attachment(:file)

	belongs_to :post

end
