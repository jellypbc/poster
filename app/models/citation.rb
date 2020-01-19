# == Schema Information
#
# Table name: citations
#
#  id                :bigint           not null, primary key
#  authors           :text
#  body              :json
#  imprint_date      :string
#  imprint_type      :string
#  publisher         :string
#  target            :string
#  title             :text
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
	belongs_to :source_post, class_name: 'Post', foreign_key: 'post_id'
	belongs_to :generated_post,class_name: 'Post', foreign_key: 'generated_post_id', dependent: :destroy, optional: true

end
