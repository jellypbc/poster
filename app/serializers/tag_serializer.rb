# == Schema Information
#
# Table name: tags
#
#  id            :bigint           not null, primary key
#  color         :string
#  slug          :string
#  taggable_type :string
#  text          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  taggable_id   :integer
#  user_id       :integer
#
# Indexes
#
#  index_tags_on_user_id  (user_id)
#

class TagSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :text, :slug, :color,
    :taggable_id, :taggable_type

end
