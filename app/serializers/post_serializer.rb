# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  abstract     :text
#  authors      :text
#  body         :json
#  imprint_date :string
#  imprint_type :string
#  plugins      :jsonb            not null
#  publish_date :datetime
#  publisher    :string
#  slug         :string
#  title        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer
#
# Indexes
#
#  index_posts_on_slug     (slug) UNIQUE
#  index_posts_on_user_id  (user_id)
#

class PostSerializer
  include FastJsonapi::ObjectSerializer
  include Rails.application.routes.url_helpers

  attributes :title, :id, :created_at, :updated_at, :plugins

  attribute :form_url do |object|
    object.id.present? ? "/posts/#{object.slug}" : "/posts"
  end

  attribute :body do |object|
    if object.body
      object.body
        .gsub("<__content__>", "<br/>")
        .gsub("</__content__>", "")
    end
  end

  attribute :cable_url do |object|
    Rails.env.development? ? "ws://localhost:3000/cable" : "wss://#{ENV["HOSTNAME"]}/cable"
  end

  attribute :upload_url do |object|
    object.uploads.first.file_url if object.uploads.any?
  end

end
