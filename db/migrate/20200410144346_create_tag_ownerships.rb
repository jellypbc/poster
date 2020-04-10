class CreateTagOwnerships < ActiveRecord::Migration[6.0]
  def change
    create_table :tag_ownerships do |t|
      t.integer :tag_id
      t.integer :post_id
      t.timestamps null: false
    end
  end
end
