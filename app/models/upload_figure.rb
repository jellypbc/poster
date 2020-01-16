# == Schema Information
#
# Table name: upload_figures
#
#  id          :bigint           not null, primary key
#  caption     :text
#  figure_type :string
#  height      :integer
#  image_data  :text
#  index       :string
#  name        :string
#  page        :integer
#  width       :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  upload_id   :integer
#
# Indexes
#
#  index_upload_figures_on_upload_id  (upload_id)
#

class UploadFigure < ApplicationRecord
	include ImageUploader::Attachment(:image)

	belongs_to :upload
	has_one :post, through: :upload

end
