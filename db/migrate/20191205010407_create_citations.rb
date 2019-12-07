class CreateCitations < ActiveRecord::Migration[6.0]
  def change
    create_table :citations do |t|

      t.timestamps
    end
  end
end
