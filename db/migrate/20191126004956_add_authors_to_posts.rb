class AddAuthorsToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :authors, :string
  end
end
