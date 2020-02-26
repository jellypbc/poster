class UsersController < ApplicationController
  before_action :fetch_user, only: [:show, :edit, :update, :destroy, :remove_avatar]
  before_action :authenticate_user!, only: [:index, :edit, :destroy, :update]

  def index
    @users = User.order(created_at: :desc)
      .paginate(page: params[:page], per_page: 50)
  end

  def show
  end

  def edit
  end

  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        @user.process_avatars if @user.avatar
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        @user.process_avatars if @user.avatar
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to root_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def remove_avatar
    @user.avatar = nil
    @user.save
    redirect_to edit_user_path(@user)
  end

  private
    def fetch_user
      @user ||= begin
        User.find_by_username(params[:id] || params[:user_id] || params[:username])
        rescue ActiveRecord::RecordNotFound => e
          # If admin, attempt to lookup by id
          if user_is_admin?
            User.find params[:id]
          else
            raise e
          end
        end
    end

    def user_params
      params.require(:user).permit(
        :username, :admin, :email, :first_name, :last_name,
        :username, :avatar
      )
    end
end
