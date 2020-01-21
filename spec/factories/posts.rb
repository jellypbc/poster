# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  abstract     :text
#  authors      :text
#  body         :json
#  publish_date :datetime
#  publisher    :string
#  slug         :string
#  title        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer
#
# Indexes
#
#  index_posts_on_slug     (slug) UNIQUE
#  index_posts_on_user_id  (user_id)
#

FactoryBot.define do
  factory :post do
    sequence(:title) {|n| "Awesome Post #{n}" }
  end
end
