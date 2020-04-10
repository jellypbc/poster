class RenameTaggableColumnsToPostInTags < ActiveRecord::Migration[6.0]
  def change
    rename_column :tags, :taggable_id, :post_id
    remove_column :tags, :taggable_type
  end
end
