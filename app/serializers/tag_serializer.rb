# == Schema Information
#
# Table name: tags
#
#  id          :bigint           not null, primary key
#  color       :string
#  posts_count :integer          default(0)
#  slug        :string
#  text        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#
# Indexes
#
#  index_tags_on_slug     (slug) UNIQUE
#  index_tags_on_user_id  (user_id)
#

class TagSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :text, :slug, :color

  attribute :username do |object|
    object.user.username if object.user
  end

  attribute :posts_count do |object|
    object.posts.any? ? object.posts.count : 0
  end

end
