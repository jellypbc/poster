class PagesController < ApplicationController
  before_action :authenticate_user!, only: [:dashboard, :admin]
  before_action :admin_only, only: :admin

	def index
    unless !user_signed_in?

      @posts = current_user.posts
        .primary
        .includes(:tags)

      @citations = current_user.posts.generated

      @tags = current_user.tags

      @user = current_user

      render 'dashboard'
    end

    @no_footer = true
    @no_nav = true
	end

  def dashboard
    redirect_to root_path
  end

  def admin
  end

  def blog
    @tag = Tag.find_by_slug("jelly-blog")
  end

  def jobs
    @no_nav = true
  end

end
