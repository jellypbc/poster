class AddPostsCountToTags < ActiveRecord::Migration[6.0]
  def change
    add_column :tags, :posts_count, :integer, default: 0
    add_index :tags, :slug, unique: true
  end
end
