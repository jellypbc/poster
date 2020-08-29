module Admin
  class ProjectsController < ApplicationController
    before_action :admin_only

    def show
    end
    
    def index
      @projects = Project.order(created_at: :desc)
        .paginate(page: params[:page], per_page: 40)
    end

  end
end