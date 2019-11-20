# == Schema Information
#
# Table name: posts
#
#  id         :bigint           not null, primary key
#  title      :string
#  body       :json
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  slug       :string
#

class Post < ApplicationRecord
	has_many :uploads

	accepts_nested_attributes_for :uploads
end
