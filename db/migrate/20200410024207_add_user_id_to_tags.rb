class AddUserIdToTags < ActiveRecord::Migration[6.0]
  def change
    add_column :tags, :user_id, :integer
    add_index :tags, :user_id
  end
end
