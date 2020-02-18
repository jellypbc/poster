Rails.application.routes.draw do
	require "sidekiq/web"
  mount Sidekiq::Web,     at: "/sidekiq" #, constraints: AdminConstraint.new
  mount ImageUploader.upload_endpoint(:cache) => "/images/cache"
  mount ImageUploader.upload_endpoint(:store) => "/images/store"
  mount FileUploader.upload_endpoint(:cache) => "/file/cache"
  mount FileUploader.upload_endpoint(:store) => "/file/store"

  devise_for :users, skip: [:sessions]
  devise_scope :user do
    get 'supersecretinvitelink', to: 'devise/registrations#new'
    get 'login', to: 'devise/sessions#new', as: :new_user_session
    post 'login', to: 'devise/sessions#create', as: :user_session
    delete 'logout', to: 'devise/sessions#destroy', as: :destroy_user_session
  end

  resources :users do
    member do
      post :remove_avatar
    end
  end

  resources :uploads do
    get :extract_images
	end

  resources :posts

	post "/file", to: "uploads#file"
  post "/posts/add_figure", to: "posts#add_figure"
  get "/write", to: "posts#write"


  if Rails.env.development?
    resource :styleguide, controller: :styleguide, only: :show
  end

  get 'dashboard', to: 'pages#dashboard'
  root to: "pages#index"

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
end
