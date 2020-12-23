class AddIndexToTags < ActiveRecord::Migration[6.1]
  def change
    add_index :tag_ownerships, [:post_id, :tag_id], unique: true
  end
end
