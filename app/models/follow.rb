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

class Follow < ApplicationRecord
  belongs_to :follower, polymorphic: true
  belongs_to :following, polymorphic: true

  validates :follower, presence: true
  validates :following, presence: true
end
