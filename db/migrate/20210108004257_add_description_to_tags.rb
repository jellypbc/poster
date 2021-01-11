class AddDescriptionToTags < ActiveRecord::Migration[6.1]
  def change
    add_column :tags, :description, :text
  end
end
