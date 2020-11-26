class ApplicationController < ActionController::Base
  include SessionsHelper

	protect_from_forgery with: :exception

	before_action :configure_permitted_parameters, if: :devise_controller?

	layout :layout_by_resource

	protected

  def after_sign_in_path_for(resource)
    params[:user] ?
      (params[:user][:redirect_to] || root_path) :
      root_path
  end

  def after_sign_out_path_for(resource)
    root_path
  end

	# https://github.com/plataformatec/devise/tree/master#strong-parameters
	def configure_permitted_parameters
    added_attrs = [:username, :email, :password, :password_confirmation, :remember_me]
		devise_parameter_sanitizer.permit(:sign_up, keys: added_attrs)
    devise_parameter_sanitizer.permit(:account_update, keys: added_attrs)
	end

  def admin_only
    unless user_is_admin?
      respond_to do |format|
        format.html { render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found }
        format.xml  { head :not_found }
        format.any  { head :not_found }
      end
    end
  end

	private

	def layout_by_resource
		if devise_controller?
			"devise"
		else
			"application"
			end
		end
end
