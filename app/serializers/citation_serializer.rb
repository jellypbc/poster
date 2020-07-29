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
class CitationSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :authors, :body, :imprint_type, :imprint_date, :publisher,
    :target, :title, :post_id, :generated_post_id

  attribute :generated_post_path do |object|
    object.generated_post.present? ? Rails.application.routes.url_helpers.post_path(object.generated_post) : "/posts"
  end

end
