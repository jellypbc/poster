class AddAbstractToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :abstract, :text
  end
end
