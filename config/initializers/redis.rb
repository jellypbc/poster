$redis =
  if ENV['REDIS_PROVIDER']
    Redis.new(url: ENV['REDIS_PROVIDER'])
  else
    Redis::Namespace.new(Rails.env, redis: Redis.new)
  end
