class FollowsController < ApplicationController
  before_action :authenticate_user!
  before_action :fetch_user

  def follow
    # auth / fetch user
    # create follow
    # respond with following data
    # binding.pry

    follow = @user.follows.new(follow_params)

    if follow.save
      respond_to do |format|
        format.json { render json: {status: 'success'}.to_json}
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
    binding.pry
    follow = @user.follows.pluck(follow_params)

    respond_to do |format|
      format.json { render json: {status: 'success'}.to_json}
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


end
