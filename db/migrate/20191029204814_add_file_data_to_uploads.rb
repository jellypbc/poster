class AddFileDataToUploads < ActiveRecord::Migration[6.0]
  def change
    add_column :uploads, :file_data, :text
  end
end
