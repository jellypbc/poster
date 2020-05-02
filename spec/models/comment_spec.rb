# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  ancestry         :string(255)
#  data_from        :string
#  data_key         :string
#  data_to          :string
#  deleted_at       :datetime
#  field_type       :integer
#  hidden           :boolean
#  highlighted_text :text
#  text             :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  post_id          :bigint
#  user_id          :bigint
#
# Indexes
#
#  index_comments_on_ancestry    (ancestry)
#  index_comments_on_data_key    (data_key) UNIQUE
#  index_comments_on_field_type  (field_type)
#  index_comments_on_post_id     (post_id)
#  index_comments_on_user_id     (user_id)
#

require 'rails_helper'

RSpec.describe Comment, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
