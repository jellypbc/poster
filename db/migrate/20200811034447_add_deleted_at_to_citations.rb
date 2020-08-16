class AddDeletedAtToCitations < ActiveRecord::Migration[6.0]
  def change
    add_column :citations, :deleted_at, :datetime
  end
end
