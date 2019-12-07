class CreateUploadTei < ActiveRecord::Migration[6.0]
  def change
    create_table :upload_teis do |t|
      t.integer :upload_id
      t.jsonb :body
      t.jsonb :header
      t.jsonb :references

    end
    add_index :upload_teis, :upload_id
  end
end
