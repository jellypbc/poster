# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  ancestry         :string(255)
#  data_from        :string
#  data_key         :string
#  data_to          :string
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
#  index_comments_on_ancestry  (ancestry)
#  index_comments_on_post_id   (post_id)
#  index_comments_on_user_id   (user_id)
#

FactoryBot.define do
  factory :comment do

  end
end
