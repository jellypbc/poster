# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  authors      :string
#  body         :json
#  publish_date :datetime
#  publisher    :string
#  slug         :string
#  title        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_posts_on_slug  (slug) UNIQUE
#

require 'rails_helper'

RSpec.describe Post, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
