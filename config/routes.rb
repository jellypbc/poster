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
    resources :tags, only: [:create, :update, :edit, :destroy, :new]
    get :suggested_tags
  end

  resources :projects do
    post :tags, only: [:create, :destroy]
  end

  resources :tags
  post '/add_tag', to: 'tags#create', as: :add_tag
  post '/remove_tag', to: 'tags#delete', as: :remove_tag

  resources :comments
  post '/add_comment', to: 'comments#create', as: :add_comment
  post '/remove_comment', to: 'comments#delete', as: :remove_comment

  resources :citations
  post '/add_citation', to: 'citations#create', as: :add_citation
  post '/remove_citation', to: 'citations#delete', as: :remove_citation

  namespace :search do
    get :paginated_results
  end
  get 'search/paginated_results/:page', to: 'search#paginated_results', defaults: {format: 'json'}

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

  get '/blog', to: redirect('tags/jelly-blog')

  get 'users/:id/paginated_posts/:page', to: 'users#paginated_posts'
  get 'users/:id/paginated_citations/:page', to: 'users#paginated_citations'

  get 'tags/:id/paginated_posts/:page', to: 'tags#paginated_posts'
  get 'tags/:id/paginated_citations/:page', to: 'tags#paginated_citations'

  namespace :admin, module: 'admin' do
    resources :users
    resources :posts
    resources :uploads
    resources :tags
    resources :projects
    resources :comments
  end

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  if Rails.env.development?
    resource :styleguide, controller: :styleguide, only: :show
  end

  root to: "pages#index"
end
