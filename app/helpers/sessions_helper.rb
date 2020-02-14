module SessionsHelper
  def authenticate!(message: "Register or sign in to continue.")
    if signed_in?
      true
    else
      session[:return_to] = request.fullpath

      path = register_path

      if params[:sign_up]
        path = register_path
        message  = "Register or sign in to continue."
      end

      redirect_to path, notice: message

      false
    end
  end

  def current_user
    # if session[:user_id]
    #   @current_user ||= User.find(session[:user_id])
    # else
    #   @current_user ||= nil
    # end
  end

  def current_user?(user)
    user == current_user
  end

  def login(user)
    session[:user_id] = user.id
    # user.reset_remember_token!
    # cookies.permanent[:remember_token] = user.remember_token
    # @current_user = user
    # user.log_session!(request.remote_ip)
  end

  def logout
    session[:user_id] = user.id
    session[:return_to] = nil
  end

  def signed_in?
    !!current_user
  end

  def set_return_url(url)
    if url.present?
      session[:return_to] = url
    end
  end

  def after_sign_in_path
    redirect_url = session.delete(:return_to)

    redirect_url || root_path
  end

  def user_is_admin?
    signed_in? && current_user.admin?
  end

  def mobile_device?
    request.user_agent =~ /Mobile|webOS/
  end

  def add_session(session_key_symbol, session_value)
    session[session_key_symbol] = session_value
  end

  def check_if_signed_in
    if signed_in?
      redirect_to root_path, notice: "Oops, you're already signed in!"
    end
  end



  private

end
