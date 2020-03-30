class CreateTags < ActiveRecord::Migration[6.0]
  def change
    create_table :tags do |t|
      t.string :text
      t.string :slug

      t.timestamps
    end
  end
end
