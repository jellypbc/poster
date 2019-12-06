class AddPostIdAndBodyToCitations < ActiveRecord::Migration[6.0]
  def change
    add_column :citations, :post_id, :integer
    add_column :citations, :body, :json

    add_index :citations, :post_id
  end
end
