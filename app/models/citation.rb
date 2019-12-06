# == Schema Information
#
# Table name: citations
#
#  id                :bigint           not null, primary key
#  authors           :string
#  body              :json
#  imprint_date      :string
#  imprint_type      :string
#  publisher         :string
#  target            :string
#  title             :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  generated_post_id :integer
#  post_id           :integer
#
# Indexes
#
#  index_citations_on_post_id  (post_id)
#

class Citation < ApplicationRecord
	belongs_to :post
	belongs_to :generated_post, class_name: 'Post', foreign_key: 'generated_post_id'

end
