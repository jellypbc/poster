$redis =
  if ENV['REDISTOGO_URL']
    Redis.new(url: ENV['REDISTOGO_URL'])
  else
    Redis::Namespace.new(Rails.env, redis: Redis.new)
  end
