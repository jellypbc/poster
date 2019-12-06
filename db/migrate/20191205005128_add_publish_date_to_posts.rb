class AddPublishDateToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :publish_date, :datetime
  end
end
