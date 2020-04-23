class CommentSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :ancestry, :data_from, :data_key, :data_to,
    :hidden, :highlighted_text, :text,
    :created_at, :updated_at, :post_id, :user_id

end

