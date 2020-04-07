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
#

class TagSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :text, :slug, :color,
    :taggable_id, :taggable_type

end
