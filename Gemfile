source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.5.7"

gem "bundler"
gem "rails", "~> 6.0.0"
gem "pg", "~> 1.1"
gem "puma", "~> 3.12"
gem "sass-rails", "~> 5"
gem "webpacker", "~> 4.0"
gem "turbolinks", "~> 5"
gem "jbuilder", "~> 2.7"
gem "bcrypt", "~> 3.1.7"
gem "slim"
gem "react-rails"
gem "shrine", "~> 3.0"
gem "shrine-google_cloud_storage"
gem "appengine"
gem "httparty"
gem "httmultiparty"
gem "font-awesome-sass"
gem "fast_jsonapi"
gem "bugsnag"
gem "will_paginate"
gem "nokogiri"
gem "sidekiq"
gem "sidekiq-cron"
gem "redis"
gem "redis-namespace"

gem "bootsnap", ">= 1.4.2", require: false

group :development, :test do
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "dotenv-rails"
  gem "rspec-rails"
  gem "rails-controller-testing"
  gem "factory_bot"
  gem "factory_bot_rails"
end

group :development do
  gem "web-console", ">= 3.3.0"
  gem "listen", ">= 3.0.5", "< 3.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
  gem "bullet"
  gem "ngrok-tunnel"
  gem "letter_opener"
  gem "annotate"
  gem "pry"
  gem "pry-rails"
  gem "bullet"
end

group :test do
  gem "capybara", ">= 2.15"
  gem "selenium-webdriver"
  gem "webdrivers"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
