class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.bigint :user_id
      t.bigint :post_id
      t.text :text
      t.text :highlighted_text
      t.boolean :hidden
      t.string :ancestry, limit: 255
      t.timestamps
    end
    add_index :comments, :ancestry
    add_index :comments, :post_id
    add_index :comments, :user_id
  end
end
