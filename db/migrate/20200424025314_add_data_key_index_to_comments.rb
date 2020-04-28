class AddDataKeyIndexToComments < ActiveRecord::Migration[6.0]
  def change
    add_index :comments, :data_key, :unique => true
  end
end
