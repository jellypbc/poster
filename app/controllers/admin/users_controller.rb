module Admin
  class UsersController < ApplicationController
    before_action :admin_only
    before_action :fetch_user, only: %i(show disable email_history comments messages)

    def show
    end

    def index
      # @filters = [:potential_bot, :researchers, :backers, :not_bot]
      # if params[:search]
      #   @users = User.includes(:identities, :user_source, user_avatar: [:upload])
      #                .user_search(params[:search])
      #                .order(created_at: :desc)
      #                .paginate(page: params[:page], per_page: 20)
      # else
      #   @users = User.includes(:identities, :user_source, user_avatar: [:upload])
      #                .not_bot
      #                .order(created_at: :desc)
      #                .paginate(page: params[:page], per_page: 20)
      # end
      # @users = @users.filter(params.slice(*@filters))
    end

    private

      def fetch_user
        @user = User.find_by_username(params[:id] || params[:user_id] || params[:username])
      end
  end
end
