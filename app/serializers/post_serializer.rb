class PostSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :id, :body, :created_at
end
