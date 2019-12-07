Rails.application.routes.draw do
	require 'sidekiq/web'
  mount Sidekiq::Web,     at: '/sidekiq', constraints: AdminConstraint.new

  resources :uploads
  resources :posts
  resources :users

  root to: 'pages#index'
end
