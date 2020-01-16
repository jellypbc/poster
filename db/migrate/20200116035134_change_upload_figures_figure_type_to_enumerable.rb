class ChangeUploadFiguresFigureTypeToEnumerable < ActiveRecord::Migration[6.0]
  def up
  	migrate_upload_figures
  	change_column :upload_figures, :figure_type, 'integer USING CAST(figure_type AS integer)'
  end

  def down
  	change_column :upload_figures, :figure_type, :string
  end

  def migrate_upload_figures
  	UploadFigure.all.update(figure_type: "0")
  end

end
