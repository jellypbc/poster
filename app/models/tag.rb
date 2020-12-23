# == Schema Information
#
# Table name: tags
#
#  id          :bigint           not null, primary key
#  color       :string
#  posts_count :integer          default(0)
#  slug        :string
#  text        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#
# Indexes
#
#  index_tags_on_slug     (slug) UNIQUE
#  index_tags_on_user_id  (user_id)
#

class Tag < ApplicationRecord
  has_many :tag_ownerships
  has_many :posts, through: :tag_ownerships

  validates :slug, presence: true, uniqueness: { case_sensitive: false }

  belongs_to :user

  before_validation :check_and_set_slug

  def to_param
    slug
  end

  private

    def check_and_set_slug
      self.slug = text.parameterize if self.slug.blank?
    end

end
