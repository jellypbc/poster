# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

def host_to_url(str)
  "http#{Rails.configuration.x.use_https ? 's' : ''}://#{str}" unless str.blank?
end

base_host = Rails.configuration.x.web_domain

assets_host   = Rails.configuration.action_controller.asset_host
assets_host ||= host_to_url(base_host)

media_host   = host_to_url(ENV['S3_ALIAS_HOST'])
media_host ||= host_to_url(ENV['S3_CLOUDFRONT_HOST'])
media_host ||= host_to_url(ENV['S3_HOSTNAME']) if ENV['S3_ENABLED'] == 'true'
media_host ||= assets_host

Rails.application.config.content_security_policy do |policy|
  policy.base_uri        :none
  policy.default_src     :none
  policy.frame_ancestors :none
  policy.font_src        :self, assets_host
  policy.img_src         :self, :https, :data, :blob, assets_host
  policy.style_src       :self, :unsafe_inline, assets_host
  policy.media_src       :self, :https, :data, assets_host
  policy.frame_src       :self, :https
  policy.manifest_src    :self, assets_host
#   policy.font_src    :self, :https, :data
#   policy.img_src     :self, :https, :data
#   policy.object_src  :none
#   policy.script_src  :self, :https
#   policy.style_src   :self, :https
#   # If you are using webpack-dev-server then specify webpack-dev-server host
#   policy.connect_src :self, :https, "http://localhost:3035", "ws://localhost:3035" if Rails.env.development?

  if Rails.env.development?
    webpacker_urls = %w(ws http).map { |protocol| "#{protocol}#{Webpacker.dev_server.https? ? 's' : ''}://#{Webpacker.dev_server.host_with_port}" }

    policy.connect_src :self, :data, :blob, assets_host, media_host, Rails.configuration.x.streaming_api_base_url, *webpacker_urls, "http://localhost:8000"
    policy.script_src  :self, :unsafe_inline, :unsafe_eval, assets_host
    policy.child_src   :self, :blob, assets_host
    policy.worker_src  :self, :blob, assets_host
  else
    policy.connect_src :self, :data, :blob, assets_host, media_host, Rails.configuration.x.streaming_api_base_url
    policy.script_src  :self, assets_host
    policy.child_src   :self, :blob, assets_host
    policy.worker_src  :self, :blob, assets_host
  end
end

# If you are using UJS then enable automatic nonce generation
# Rails.application.config.content_security_policy_nonce_generator = -> request { SecureRandom.base64(16) }

# Set the nonce only to specific directives
# Rails.application.config.content_security_policy_nonce_directives = %w(script-src)

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
# Rails.application.config.content_security_policy_report_only = true
