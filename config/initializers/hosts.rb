# frozen_string_literal: true

port     = ENV.fetch('PORT') { 3000 }
host     = ENV.fetch('HOSTNAME') { "localhost:#{port}" }
web_host = ENV.fetch('HOSTNAME') { host }

Rails.application.configure do
  config.x.local_domain = host
  config.x.web_domain   = web_host
  config.x.grobid_host = ENV['GROBID_HOST']
  config.x.figure_host = ENV['FIGURE_HOST']

  config.action_mailer.default_url_options = {
    host: web_host,
    protocol: 'https://',
    trailing_slash: false
  }

  config.x.streaming_api_base_url = ENV.fetch('STREAMING_API_BASE_URL') do
    Rails.env.development? ? "ws://localhost:3000" : "wss://#{web_host}"
  end
end
