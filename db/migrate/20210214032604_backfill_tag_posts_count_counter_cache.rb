class BackfillTagPostsCountCounterCache < ActiveRecord::Migration[6.1]
  def change
    Tag.all.map {|t| Tag.reset_counters(t.id, :posts)}
  end
end
