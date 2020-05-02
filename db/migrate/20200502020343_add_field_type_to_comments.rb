class AddFieldTypeToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :field_type, :integer
  end
end
