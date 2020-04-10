class TagsController < ApplicationController
  before_action :set_tag, only: [:show, :edit, :update, :destroy]
  before_action :set_post, only: [:show, :create, :edit, :update, :destroy]

  def index
    @tags = Tag.all
  end

  def show
    @posts = @tag.posts
  end

  def new
    @tag = Tag.new
  end

  def edit
  end

  def create
    @tag = Tag.find_or_create_by(text: tag_params[:text])

    if @tag.save
      @post.tags << @tag if @post
      respond_to do |format|
        format.html { redirect_to @tag }
        format.json { render json: TagSerializer.new(@tag).serializable_hash, status: :ok }
      end
    else
      respond_to do |format|
        head :bad_request
      end
    end
  end

  def update
    respond_to do |format|
      if @post && @post.tags << @tag
        format.json { render json: TagSerializer.new(@tag).serializable_hash, status: :ok }
      else
        head :bad_request
      end
    end
  end

  def destroy
    @tag.destroy
    respond_to do |format|
      format.html { head :ok }
      format.json { head :ok }
    end
  end

  private
    def set_tag
      id_or_slug = params[:id] || params[:slug]
      if params[:tag]
        id_or_slug = tag_params[:id] || tag_params[:slug]
      end
      @tag ||= begin
        Tag.find_by! slug: id_or_slug.parameterize
      rescue ActiveRecord::RecordNotFound => e
        Tag.find id_or_slug
      end
    end

    def set_post
      if params[:tag]
        if tag_params[:post_id]
          @post = Post.find tag_params[:post_id]
        end
      end
    end

    def tag_params
      params.require(:tag).permit(
        :id, :text, :slug, :post_id, :user_id
      )
    end

end
