module Admin
  class UploadsController < ApplicationController
    before_action :admin_only

    def show
    end

    def index
      @uploads = Upload.order(created_at: :desc)
        .paginate(page: params[:page], per_page: 30)
    end

    private

      def fetch_user
        @user = User.find_by_username(params[:id] || params[:user_id] || params[:username])
      end
  end
end
