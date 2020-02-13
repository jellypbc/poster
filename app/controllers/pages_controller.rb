class PagesController < ApplicationController
  before_action :authenticate_user!, only: :dashboard

	def index
    @no_footer = true

    if !user_signed_in?
      @no_nav = true

    else
      @posts = Post.primary
      	.last(3)
      	.reverse
      render 'dashboard'
    end
	end


  def dashboard
    @posts = current_user.posts
  end

end
