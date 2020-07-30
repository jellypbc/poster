# == Schema Information
#
# Table name: citations
#
#  id                :bigint           not null, primary key
#  authors           :text
#  body              :json
#  imprint_date      :string
#  imprint_type      :string
#  publisher         :string
#  target            :string
#  title             :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  generated_post_id :integer
#  post_id           :integer
#
# Indexes
#
#  index_citations_on_post_id  (post_id)
#
class BacklinkSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :imprint_type, :imprint_date, :publisher,
    :target, :post_id, :generated_post_id

  attribute :source_post_path do |object|
    object.source_post.present? ? Rails.application.routes.url_helpers.post_path(object.source_post) : "/posts"
  end

  attribute :title do |object|
    Sanitize.clean(object.source_post.title) if object.source_post
  end

  attribute :authors do |object|
    Sanitize.clean(object.source_post.authors) if object.source_post
  end

  attribute :publisher do |object|
    Sanitize.clean(object.source_post.publisher) if object.source_post
  end

  attribute :imprint_date do |object|
    Sanitize.clean(object.source_post.imprint_date) if object.source_post
  end

  attribute :imprint_type do |object|
    Sanitize.clean(object.source_post.imprint_type) if object.source_post
  end

end
