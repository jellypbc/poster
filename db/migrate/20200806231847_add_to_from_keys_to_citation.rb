class AddToFromKeysToCitation < ActiveRecord::Migration[6.0]
  def change
    add_column :citations, :data_from, :string
    add_column :citations, :data_key, :string
    add_column :citations, :data_to, :string
    add_column :citations, :highlighted_text, :text
    add_column :citations, :field_type, :integer
  end
end
