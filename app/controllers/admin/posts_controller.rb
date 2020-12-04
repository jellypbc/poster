module Admin
  class PostsController < ApplicationController
    before_action :admin_only

    def show
    end

    def index
      @posts = Post.order(created_at: :desc)
        .paginate(page: params[:page], per_page: 40)
    end

    private

      def fetch_post
        @user = User.find_by_username(params[:id] || params[:user_id] || params[:username])
      end
  end
end
