class AddImprintDateToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :imprint_date, :string
    add_column :posts, :imprint_type, :string
  end
end
