# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  ancestry         :string(255)
#  data_from        :string
#  data_key         :string
#  data_to          :string
#  deleted_at       :datetime
#  hidden           :boolean
#  highlighted_text :text
#  text             :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  post_id          :bigint
#  user_id          :bigint
#
# Indexes
#
#  index_comments_on_ancestry  (ancestry)
#  index_comments_on_data_key  (data_key) UNIQUE
#  index_comments_on_post_id   (post_id)
#  index_comments_on_user_id   (user_id)
#

class Comment < ApplicationRecord
  validates :data_key, uniqueness: true

  belongs_to :post
  belongs_to :user, optional: true

  default_scope { where(deleted_at: nil) }

  def delete_now
    touch(:deleted_at)
  end

end
