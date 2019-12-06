# == Schema Information
#
# Table name: citations
#
#  id         :bigint           not null, primary key
#  body       :json
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :integer
#
# Indexes
#
#  index_citations_on_post_id  (post_id)
#

class Citation < ApplicationRecord
end
