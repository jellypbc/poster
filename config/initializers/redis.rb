uri = ENV["REDIS_URL"] || "redis://localhost:6379/"
$redis = Redis.new(url: uri)
