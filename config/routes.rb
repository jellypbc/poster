Rails.application.routes.draw do
  devise_for :users
	require 'sidekiq/web'

  mount Sidekiq::Web,     at: '/sidekiq' #, constraints: AdminConstraint.new

  mount ImageUploader.upload_endpoint(:cache) => "/images/cache"
  mount ImageUploader.upload_endpoint(:store) => "/images/upload"

  resources :uploads do
    get :extract_images
	end
  resources :posts
  resources :users

  if Rails.env.development?
    resource :styleguide, controller: :styleguide, only: :show
  end

  root to: 'pages#index'
end
