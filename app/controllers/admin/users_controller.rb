module Admin
  class UsersController < ApplicationController
    before_action :admin_only
    before_action :fetch_user, only: [:show]

    def show
    end

    def index
      @users = User.order(created_at: :desc)
        .paginate(page: params[:page], per_page: 50)
    end

    private

      def fetch_user
        @user = User.find_by_username(params[:id] || params[:user_id] || params[:username])
      end
  end
end
