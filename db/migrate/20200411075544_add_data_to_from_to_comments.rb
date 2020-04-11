class AddDataToFromToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :data_to, :string
    add_column :comments, :data_from, :string
    add_column :comments, :data_key, :string
  end
end
