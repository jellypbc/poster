class AddPublishedAtToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :published_at, :datetime
    add_column :posts, :visibility, :integer
    add_column :posts, :deleted_at, :datetime
  end
end
