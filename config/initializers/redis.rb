uri = ENV["REDISTOGO_URL"] || "redis://localhost:6379/"
$redis = Redis.new(url: uri)
# $redis = Redis.new(Rails.application.config(:redis))
