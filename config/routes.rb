Rails.application.routes.draw do
	require 'sidekiq/web'

  mount Sidekiq::Web,     at: '/sidekiq' #, constraints: AdminConstraint.new
  mount ImageUploader.upload_endpoint(:cache) => '/images/cache'
  mount ImageUploader.upload_endpoint(:store) => '/images/store'
  mount FileUploader.upload_endpoint(:cache) => '/file/cache'
  mount FileUploader.upload_endpoint(:store) => '/file/store'

  devise_for :users, skip: [:sessions]
  devise_scope :user do
    get 'supersecretinvitelink', to: 'devise/registrations#new'

    post 'guestcreate', to: 'users#create'
    get 'upgrade', to: 'users#new'
    post 'upgrade', to: 'users#upgrade'

    get 'login', to: 'devise/sessions#new', as: :new_user_session
    post 'login', to: 'devise/sessions#create', as: :user_session
    delete 'logout', to: 'devise/sessions#destroy', as: :destroy_user_session
  end

  get '/@:username', to: 'users#show', as: :short_user
  get '/@:username/:id', to: 'posts#show', as: :short_user_post
  get '/@:username/:id/edit', to: 'posts#edit'
  get '/@:username/tags/:id', to: 'tags#show', as: :short_user_tag

  resources :users do
    resources :tags do
      get :show
    end
    member do
      post :remove_avatar
      post :follow
      post :unfollow
    end
  end

  resources :uploads do
    get :extract_images
	end

  resources :posts do
    resources :tags
    get :suggested_tags
  end

  resources :projects do
    post :tags, only: [:create, :destroy]
  end

  resources :tags

  resources :comments
  post '/add_comment', to: 'comments#create', as: :add_comment
  post '/remove_comment', to: 'comments#delete', as: :remove_comment

  namespace :search do
    get :results
    get :bar
  end
  get 'search/results'

	post '/file', to: 'uploads#file'
  post '/posts/add_figure', to: 'posts#add_figure'
  get '/write', to: 'posts#write'

  get '/about', to: 'pages#about'
  get '/terms', to: 'pages#terms'
  get '/dashboard', to: 'pages#dashboard'

  get '/admin', to: 'pages#admin'
  get '/pricing', to: 'pages#pricing'
  get '/internship', to: 'pages#jobs'

  namespace :admin, module: 'admin' do
    resources :users
    resources :posts
    resources :uploads
  end

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  if Rails.env.development?
    resource :styleguide, controller: :styleguide, only: :show
  end

  root to: "pages#index"
end
