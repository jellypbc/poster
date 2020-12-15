class SessionsController < ApplicationController
  before_action :check_if_signed_in, only: [:new, :create]

  def new
    super
  end

  # This isnt currently in use
  def create
    user = User.find_by_email(session_params[:email])

    if user && user.authenticate(session_params[:password])
      session[:user_id] = user.id
      redirect_url = params[:redirect_to] || after_sign_in_path
      msg = "Welcome back, #{user.full_name}."

      respond_to do |format|
        format.html { redirect_to redirect_url, notice: msg }
        format.js   { render json: { logged_in: true } }
        format.json { render json: user }
      end
    else
      redirect_to(new_user_session_path, notice: "Oops, sorry. Something was wrong with your email or password.")
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path, notice: "Logged out!"
  end

  private

  def session_params
    params.require(:session).permit(
      :email, :password
    ).to_h
  end

end
