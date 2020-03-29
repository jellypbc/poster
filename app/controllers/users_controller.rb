class UsersController < ApplicationController
  before_action :fetch_user, only: [:show, :edit, :update, :destroy, :remove_avatar, :follow, :unfollow]
  before_action :authenticate_user!, only: [:index, :edit, :destroy, :update, :remove_avatar, :follow, :unfollow]

  def index
    @users = User.order(created_at: :desc)
      .paginate(page: params[:page], per_page: 50)
  end

  def show
    @primary_posts = @user.posts.primary.order(created_at: :desc).paginate(page: params[:page], per_page: 10)
    @generated_posts = @user.posts.generated.order(created_at: :desc).paginate(page: params[:page], per_page: 10)
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

  def follow
    # auth / fetch user
    # create follow
    # respond with following data
    # binding.pry

    follow = current_user.follows.new(follow_params)

    if follow.save
      respond_to do |format|
        format.json { render json: {status: 'success'}.to_json }
      end
    else
      respond_to do |format|
        format.json { render json: follow.errors, status: :unprocessable_entity }
      end
    end

  end

  def unfollow
    # auth / fetch user
    # create follow
    # respond with following data
    # binding.pry
    follow = current_user.follows.find_by_following_id follow_params[:following_id]
    if follow && follow.destroy
      respond_to do |format|
        format.json { render json: {status: 'success'}.to_json }
      end
    else
      respond_to do |format|
        format.json { render json: follow.errors, status: :unprocessable_entity }
      end
    end
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
        :avatar
      )
    end

    def follow_params
      params.require(:follow).permit(
        :follower_type, :follower_id, :following_type, :following_id
      )
    end

end
