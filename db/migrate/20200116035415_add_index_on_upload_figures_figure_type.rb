class AddIndexOnUploadFiguresFigureType < ActiveRecord::Migration[6.0]
  def change
  	add_index :upload_figures, :figure_type
  end
end
