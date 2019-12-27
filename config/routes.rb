Rails.application.routes.draw do
  devise_for :users
	require 'sidekiq/web'
  mount Sidekiq::Web,     at: '/sidekiq', constraints: AdminConstraint.new

  resources :uploads
  resources :posts
  resources :users

  if Rails.env.development?
    resource :styleguide, controller: :styleguide, only: :show
  end

  root to: 'pages#index'
end
