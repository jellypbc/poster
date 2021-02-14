# == Schema Information
#
# Table name: tags
#
#  id          :bigint           not null, primary key
#  color       :string
#  description :text
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

  attributes :id, :text, :slug, :color, :posts_count

  attribute :username do |object|
    object.user.username if object.user
  end

end
