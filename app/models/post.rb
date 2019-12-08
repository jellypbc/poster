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

class Post < ApplicationRecord
  include Slugged
  include SlugHistory

  slug :title, attribute: :slug
  remember_slug

	has_many :uploads
	has_many :citations

	accepts_nested_attributes_for :uploads

  validates :title, length: { maximum: 120 }

	scope :primary, -> { joins(:uploads) }

	def to_param
    slug
  end

end
