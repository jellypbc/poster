class AddPublisherToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :publisher, :string
  end
end
