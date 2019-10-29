# == Schema Information
#
# Table name: posts
#
#  id         :integer          not null, primary key
#  title      :string
#  body       :json
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Post < ApplicationRecord
	has_many :uploads

	accepts_nested_attributes_for :uploads
end
