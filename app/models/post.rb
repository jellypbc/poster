# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  abstract     :text
#  authors      :text
#  body         :json
#  deleted_at   :datetime
#  imprint_date :string
#  imprint_type :string
#  plugins      :jsonb            not null
#  publish_date :datetime
#  published_at :datetime
#  publisher    :string
#  slug         :string
#  title        :text
#  visibility   :integer          default("public"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer
#
# Indexes
#
#  index_posts_on_slug     (slug) UNIQUE
#  index_posts_on_user_id  (user_id)
#

class Post < ApplicationRecord
  include Slugged
  include SlugHistory

  slug :title, attribute: :slug
  remember_slug

  enum visibility: [:public, :draft, :private], _suffix: :visibility

  belongs_to :user, optional: true
	has_many :uploads
	has_many :citations
  has_many :figures, through: :uploads, source: :upload_figures, class_name: 'UploadFigure'
  has_many :tags, as: :taggable

	accepts_nested_attributes_for :uploads

  validates :title, length: { maximum: 1000 }

	scope :primary, -> { joins(:uploads) }
  scope :generated, -> { includes(:uploads).where(uploads: { id: nil }) }

	def to_param
    slug
  end

  def primary?
    uploads.present?
  end

  def add_tags_by_texts=(texts)
    new_tags = texts.map do |text|
      Tag.find_or_create_by(text: text, taggable_id: self.id, taggable_type: "Post")
    end
    (tags - new_tags).map{ |tag| tag.destroy }
  end

end
