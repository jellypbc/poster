class CreateUploadImages < ActiveRecord::Migration[6.0]
  def change
    create_table :upload_images do |t|
    	t.integer :upload_id
      t.string :name
      t.text :caption
      t.integer :page
    	t.string :figure_type
			t.integer :width
			t.integer :height
			t.string :index
      t.text :image_data

      t.timestamps
    end
    add_index :upload_images, :upload_id
  end
end
