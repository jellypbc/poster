Rails.application.routes.draw do
	require 'sidekiq/web'
	authenticate :user, lambda { |u| u.admin? } do
	  mount Sidekiq::Web => '/sidekiq'
	end

  resources :uploads
  resources :posts
  resources :users

  root to: 'pages#index'
end
