# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  authors      :string
#  body         :json
#  publish_date :datetime
#  publisher    :string
#  slug         :string
#  title        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_posts_on_slug  (slug) UNIQUE
#

class PostSerializer
  include FastJsonapi::ObjectSerializer
  include Rails.application.routes.url_helpers

  attributes :title, :id, :created_at

  attribute :form_url do |object|
    object.id.present? ? "/posts/#{object.id}" : "/posts"
    # object.id.present? ? "/posts/#{object.slug}" : "/posts"
  end

  attribute :body do |object|
  	object.body
  		.gsub("<__content__>", "<br/>")
  		.gsub("</__content__>", "")
  end

end
