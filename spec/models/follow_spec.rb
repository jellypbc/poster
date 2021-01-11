# == Schema Information
#
# Table name: follows
#
#  id             :bigint           not null, primary key
#  follower_type  :string
#  following_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  follower_id    :integer          not null
#  following_id   :integer          not null
#
# Indexes
#
#  follows_unique_index  (follower_id,following_id,follower_type,following_type) UNIQUE
#

require 'rails_helper'

RSpec.describe Follow, type: :model do
end
