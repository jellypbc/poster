source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.1"

gem "bundler", "~> 2.1.4"
gem "rails", "~> 6.0.3.2"
gem "pg", "~> 1.1"
gem "puma", "~> 4.3"
gem "sassc-rails", "~> 2.1"
gem "webpacker", "~> 4.0"
gem "turbolinks", "~> 5"
gem "jbuilder", "~> 2.7"
gem "bcrypt", "~> 3.1.7"
gem "devise"
gem "devise-guests"
gem "slim"
gem "react-rails"
gem "shrine", "~> 3.2"
gem "shrine-google_cloud_storage", "~> 3.0"
gem "image_processing", "~> 1.8"
gem "mimemagic"
gem "appengine"
gem "httparty"
gem "httmultiparty"
gem "font-awesome-sass"
gem "fast_jsonapi"
gem "will_paginate"
gem "will_paginate-bootstrap4"
gem "nokogiri"
gem "sidekiq"
gem "sidekiq-batch"
gem "sidekiq-cron"
gem "redis"
gem "rack-attack"
gem "rack-timeout", require:"rack/timeout/base"
gem "sanitize"
gem "bootsnap", ">= 1.4.2", require: false
gem "searchkick"
gem "typhoeus"
gem "oj"
gem "actionpack", ">= 6.0.3.2"

group :development, :test do
  gem "rspec-rails", '~> 4.0'
  gem "guard", "~> 2.16"
  gem "guard-rspec", "~> 4.7", require: false
  gem "guard-livereload", "~> 2.5", require: false
  gem "dotenv-rails"
  gem "rails-controller-testing"
  gem "factory_bot"
  gem "factory_bot_rails"
  gem "rspec_junit_formatter"
  gem "shoulda-matchers"
  gem "pry"
  gem "pry-rails"
  gem "docker-sync", require: false
end

group :development do
  gem "rubocop"
  gem "byebug", platforms: :mri
  gem "web-console", ">= 3.3.0"
  gem "listen", ">= 3.0.5", "< 3.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
  gem "bullet"
  gem "ngrok-tunnel", require: false
  gem "letter_opener", "~> 1.7"
  gem "letter_opener_web", "~> 1.3"
  gem "annotate"
  gem "foreman"
end

group :test do
  gem "capybara", ">= 2.15"
  gem "selenium-webdriver"
  gem "webdrivers"
end

group :production do
  gem "bugsnag"
  gem "scout_apm"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
