# == Schema Information
#
# Table name: citations
#
#  id                :bigint           not null, primary key
#  authors           :text
#  body              :json
#  data_from         :string
#  data_key          :string
#  data_to           :string
#  field_type        :integer
#  highlighted_text  :text
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

require 'rails_helper'

RSpec.describe Citation, type: :model do
end
