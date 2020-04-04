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

FactoryBot.define do
  factory :project do
    sequence(:title) {|n| "Awesome Biology Post #{n}" }
  end
end
