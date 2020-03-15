class CreateFollows < ActiveRecord::Migration[6.0]
  def change
    create_table :follows do |t|
      t.integer :follower_id,  polymorphic: true, null: false
      t.integer :following_id, polymorphic: true, null: false
      t.string :follower_type
      t.string :following_type

      t.timestamps
    end

    add_index :follows, [:follower_id, :following_id, :follower_type, :following_type], unique: true, name: "follows_unique_index"
  end
end
