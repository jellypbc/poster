# Allow local requests
# Otherwise getting unconcatenated assets locally
# will trigger throttling
Rack::Attack.safelist('whitelist localhost') do |req|
  %w(127.0.0.1 ::1).include? req.ip
end

Rack::Attack.throttle('req/ip', limit: 20, period: 1.second) do |req|
  # If the return value is truthy, the cache key for the return value
  # is incremented and compared with the limit. In this case:
  #   "rack::attack:#{Time.now.to_i/1.second}:req/ip:#{req.ip}"
  #
  # If falsy, the cache key is neither incremented nor checked.

  req.ip
end

Rack::Attack.blocklist('block some jerk') { |req| req.ip =~ /141.255.181.19/ }
Rack::Attack.blocklist('block wp-login fan') { |req| req.ip =~ /78.46.36.144/ }
