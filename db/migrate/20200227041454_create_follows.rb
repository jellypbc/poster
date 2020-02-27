class CreateFollows < ActiveRecord::Migration[6.0]
  def change
    create_table :follows do |t|
      t.integer :user_id, null: false
      t.integer :target_user_id, null: false
    end

    add_index :follows, [:user_id, :target_user_id], unique: true

  end
end
