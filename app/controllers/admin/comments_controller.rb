module Admin
  class CommentsController < ApplicationController
    before_action :admin_only

    def show
    end
    
    def index
      @comments = Comment.all
    end

    private

      def fetch_comment
        @user = User.find_by_username(params[:id] || params[:user_id] || params[:username])
      end
  end
end