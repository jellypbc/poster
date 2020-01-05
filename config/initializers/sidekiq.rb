# Sidekiq.configure_server do |config|
  ##### commenting out for later use
  # schedule_file = "config/schedule.yml"
  # if File.exists?(schedule_file)
  #   Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
  # end
# end
uri = ENV["REDIS_URL"] || "redis://localhost:6379/"

Sidekiq.configure_server do |config|
  config.redis = {
  	url: uri,
  	network_timeout: 5
  }
end

Sidekiq.configure_client do |config|
  config.redis = {
  	url: uri,
  	network_timeout: 5
  }
end
