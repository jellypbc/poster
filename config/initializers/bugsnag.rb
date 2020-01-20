if Rails.env.production? || Rails.env.staging?
	Bugsnag.configure do |config|
	  config.api_key = ENV['BUGSNAG_API_KEY']
	  config.app_version = ENV['HEROKU_RELEASE_VERSION']
	  config.notify_release_stages = %w(production staging)
	end
end
