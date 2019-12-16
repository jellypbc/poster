class ChangeStringColumnsToTextForCitationsAndPosts < ActiveRecord::Migration[6.0]
  def change
    change_column :citations, :title, :text
    change_column :citations, :authors, :text

    change_column :posts, :title, :text
    change_column :posts, :authors, :text
  end
end
