# == Schema Information
#
# Table name: projects
#
#  id           :bigint           not null, primary key
#  description  :text
#  munged_title :string
#  title        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Project < ApplicationRecord
  BLACKLIST = %w(new edit destroy update posts post)

  validates :munged_title, presence: true, uniqueness: { case_sensitive: false }
  validate :allowed_slug

  # Project.create
  before_validation :set_placeholder_slug, on: :create
  before_save :set_munged_title!

  def to_param
    munged_title
  end

  def set_placeholder_slug
    unless read_attribute(:munged_title)
      placeholder = (0...6).map{(65+rand(26)).chr}.join.downcase
      write_attribute :munged_title, placeholder
    end
  end

  def allowed_slug
    if BLACKLIST.include? send(:munged_title)
      errors.add :munged_title, 'This slug is unavailable'
    end
  end

  def set_munged_title!
    write_attribute :munged_title, generate_munged_title
  end

  def generate_munged_title
    pending_munged_title = ActionController::Base.helpers.strip_tags(title).parameterize
    if Project.where("munged_title=?", pending_munged_title).any?
      sequence = self.class.where("munged_title like '#{pending_munged_title}-%'").count + 2
      pending_munged_title = "#{pending_munged_title}-#{sequence}"
    end
    pending_munged_title
  end

end
