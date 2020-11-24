class PagesController < ApplicationController
  before_action :authenticate_user!, only: [:dashboard, :admin]
  before_action :admin_only, only: :admin

	def index
    unless !user_signed_in?

      @posts = current_user.posts
        .primary
        .includes(:tags)
        .order(created_at: :desc)
        .paginate(page: params[:page], per_page: 10)

      @tags = current_user.tags.sort_by { |tag| tag.slug}

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

  def jobs
    @no_nav = true
  end

end
