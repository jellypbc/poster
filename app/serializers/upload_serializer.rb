class UploadSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :file_data, :created_at, :updated_at,
  :post_id, :user_id

end
