# == Schema Information
#
# Table name: post_ownerships
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :bigint
#  user_id    :bigint
#
# Indexes
#
#  index_post_ownerships_on_post_id              (post_id)
#  index_post_ownerships_on_post_id_and_user_id  (post_id,user_id)
#  index_post_ownerships_on_user_id              (user_id)
#
require 'rails_helper'

RSpec.describe PostOwnership, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
