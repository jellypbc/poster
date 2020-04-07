class RenameUserNameColumns < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :first_name, :full_name
    rename_column :users, :last_name, :description
  end
end
