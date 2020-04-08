class PagesController < ApplicationController
  before_action :authenticate_user!, only: [:dashboard, :admin]
  before_action :admin_only, only: :admin

	def index
    @no_footer = true

    if !user_signed_in?
      @no_nav = true

    else
      @posts = Post.primary
      .includes(:tags, :uploads, :user)
      .last(3)
      .reverse
      @tags = @posts.map(&:tags).flatten
      render 'dashboard'
    end
	end

  def dashboard
    @posts = current_user.posts.primary
    .includes(:tags)
    .order(created_at: :desc)
    @tags = @posts.map(&:tags).flatten
  end

  def admin
  end

  def jobs
    @no_nav = true
  end

end
