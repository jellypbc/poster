class AddPostIdAndBodyToCitations < ActiveRecord::Migration[6.0]
  def change
    add_column :citations, :post_id, :integer
    add_column :citations, :body, :json
    add_column :citations, :title, :string
    add_column :citations, :authors, :string
    add_column :citations, :imprint_date, :string
    add_column :citations, :imprint_type, :string
    add_column :citations, :target, :string
    add_column :citations, :publisher, :string
    add_column :citations, :generated_post_id, :integer

    add_index :citations, :post_id
  end
end
