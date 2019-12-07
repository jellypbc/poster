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

require 'test_helper'

class UploadTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
