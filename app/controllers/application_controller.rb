class ApplicationController < ActionController::Base
	protect_from_forgery with: :exception

	# NOTE: Some pages may be exempt from immediate authentication,
	# ie, if there is a help or info page served by Rails,
	# or if you can create an anonymous post. If this happens,
	# move this filter or create a new base controller without it.
	before_action :authenticate_user!

	layout :layout_by_resource

  private

  def layout_by_resource
    if devise_controller?
      "devise"
    else
      "application"
    end
  end
end
