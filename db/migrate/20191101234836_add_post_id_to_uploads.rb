class AddPostIdToUploads < ActiveRecord::Migration[6.0]
  def change
    add_column :uploads, :post_id, :integer

    add_index :uploads, :post_id
  end
end
