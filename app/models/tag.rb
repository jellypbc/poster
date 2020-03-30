# == Schema Information
#
# Table name: tags
#
#  id            :bigint           not null, primary key
#  color         :string
#  slug          :string
#  taggable_type :string
#  text          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  taggable_id   :integer
#

class Tag < ApplicationRecord
  belongs_to :taggable, polymorphic: true, optional: true

  # validates :slug, presence: true, uniqueness: { case_sensitive: false }

  before_validation :check_and_set_slug

  # def to_param
  #   slug
  # end

  private

    def check_and_set_slug
      self.slug = text.parameterize if self.slug.blank?
    end

end
