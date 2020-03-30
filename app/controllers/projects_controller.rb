class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  def index
    @projects = Project.order(created_at: :desc)
      .paginate(page: params[:page], per_page: 40)
  end

  def show
  end

  def new
    @project = Project.new
  end

  def edit
  end

  def create
    @project = Project.new(project_params)

    respond_to do |format|
      if @project.save
        format.html { redirect_to @project, notice: 'project was successfully created.' }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to @project, notice: 'project was successfully updated.' }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url, notice: 'project was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def set_project
      id_or_munged_title = params[:munged_title] || params[:id] || params[:project_id]
      @project ||= begin
        Project.find_by! munged_title: id_or_munged_title
      rescue ActiveRecord::RecordNotFound => e
        Project.find id_or_munged_title
      end
    end

    def project_params
      params.require(:project).permit(
        :title, :munged_title, :description
      )
    end
end
