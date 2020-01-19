class UploadsController < ApplicationController
  before_action :set_upload, only: [
    :show, :edit, :update, :destroy, :extract_images
  ]

  def index
    @uploads = Upload.order(created_at: :desc)
      .paginate(page: params[:page], per_page: 50)
  end

  def show
  end

  def new
    @upload = Upload.new
  end

  def edit
  end

  def create
    @upload = Upload.new(upload_params)

    @post = Post.create!
    @upload.post = @post

    respond_to do |format|
      if @upload.save
        format.html { redirect_to @upload.post, notice: 'Upload was successfully created. Please refresh the page!' }
        format.json { render :show, status: :created, location: @upload }
      else
        format.html { render :new }
        format.json { render json: @upload.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @upload.update(upload_params)
        format.html { redirect_to @upload, notice: 'Upload was successfully updated.' }
        format.json { render :show, status: :ok, location: @upload }
      else
        format.html { render :edit }
        format.json { render json: @upload.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @upload.destroy
    respond_to do |format|
      format.html { redirect_to uploads_url, notice: 'Upload was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def extract_images
    FiguresExtractService.extract(@upload.id)
    redirect_to upload_path(@upload), notice: "Queued upload for figure extraction"
  end

  private
    def set_upload
      @upload ||= begin
        Upload.find(params[:id] || params[:upload_id])
      rescue ActiveRecord::RecordNotFound => e
        raise e
      end
    end

    def upload_params
      params.require(:upload).permit(:file)
    end
end
