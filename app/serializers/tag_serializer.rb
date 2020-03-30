class TagSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :text, :slug, :color,
    :taggable_id, :taggable_type

end