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

class Post < ApplicationRecord
  include Slugged
  include SlugHistory

  slug :title, attribute: :slug
  remember_slug

	has_many :uploads
	has_many :citations
  has_many :figures, through: :uploads, source: :upload_figures, class_name: 'UploadFigure'

	accepts_nested_attributes_for :uploads

  validates :title, length: { maximum: 1000 }

	scope :primary, -> { joins(:uploads) }

	def to_param
    slug
  end

end
