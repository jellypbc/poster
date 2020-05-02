class AddIndexToCommentFieldType < ActiveRecord::Migration[6.0]
  def change
    add_index :comments, :field_type
  end
end
