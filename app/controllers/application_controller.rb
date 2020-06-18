class ApplicationController < ActionController::Base
  include SessionsHelper

	protect_from_forgery with: :exception

	# TODO: reenable authenticaion
	# disabled for hosted demo
	# Some pages may be exempt from immediate authentication,
	# ie, if there is a help or info page served by Rails,
	# or if you can create an anonymous post. If this happens,
	# move this filter or create a new base controller without it
	# before_action :authenticate_user!
	before_action :configure_permitted_parameters, if: :devise_controller?

	layout :layout_by_resource

	protected

  def after_sign_in_path_for(resource)
    root_path
  end

  def after_sign_out_path_for(resource)
    root_path
  end

	# https://github.com/plataformatec/devise/tree/master#strong-parameters
	def configure_permitted_parameters
		devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email])
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
