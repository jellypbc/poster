class RenameUploadImageToUploadFigure < ActiveRecord::Migration[6.0]
  def change
  	rename_table :upload_images, :upload_figures
  end
end
