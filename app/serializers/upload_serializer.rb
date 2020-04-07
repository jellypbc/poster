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

class UploadSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :file_data, :created_at, :updated_at,
  :post_id, :user_id

end
