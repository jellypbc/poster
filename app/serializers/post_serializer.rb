# == Schema Information
#
# Table name: posts
#
#  id         :bigint           not null, primary key
#  title      :string
#  body       :json
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  slug       :string
#

class PostSerializer
  include FastJsonapi::ObjectSerializer
  include Rails.application.routes.url_helpers

  attributes :title, :id, :body, :created_at

  attribute :form_url do |object|
    object.id.present? ? "/posts/#{object.id}" : "/posts"
    # object.id.present? ? "/posts/#{object.slug}" : "/posts"
  end

end
