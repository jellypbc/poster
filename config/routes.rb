Rails.application.routes.draw do

  resources :uploads
  resources :posts
  resources :users
  root to: 'pages#index'
end
