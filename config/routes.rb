Rails.application.routes.draw do
  devise_for :users
	require "sidekiq/web"

  mount Sidekiq::Web,     at: "/sidekiq" #, constraints: AdminConstraint.new

  mount ImageUploader.upload_endpoint(:cache) => "/images/cache"
  mount ImageUploader.upload_endpoint(:store) => "/images/upload"

  mount FileUploader.upload_endpoint(:cache) => "/file/cache"
  mount FileUploader.upload_endpoint(:store) => "/file/store"

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  resources :uploads do
    get :extract_images
    # collection do
	   #  get "presign/s3/params", to: "photos#presign"
	  # end
	end
	post "/file", to: "uploads#file"
  post "/posts/add_figure", to: "posts#add_figure"

  resources :posts
  resources :users

  if Rails.env.development?
    resource :styleguide, controller: :styleguide, only: :show
  end

  root to: "pages#index"
end
