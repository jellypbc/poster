class AddPluginsToPost < ActiveRecord::Migration[6.0]
	def change
		add_column :posts, :plugins, :jsonb, null: false, default: '{}'
	end
end
