class CreatePostOwnerships < ActiveRecord::Migration[6.0]
  def change
    create_table :post_ownerships do |t|
      t.references :user
      t.references :post

      t.timestamps
    end

    add_index :post_ownerships, [:post_id, :user_id]

  end
end
