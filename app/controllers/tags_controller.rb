class TagsController < ApplicationController
  before_action :authenticate_user!, only: [:edit, :create, :update, :destroy, :add_tag, :remove_tag]
  before_action :set_tag, only: [:show, :edit, :update, :destroy, :add_tag, :remove_tag, :paginated_posts, :paginated_citations]
  before_action :set_target_post, only: [:add_tag, :remove_tag, :create]

  def show
    @posts = @tag.posts
      .order(created_at: :desc)
      .limit(10)

    post_ids = @tag.posts.map{ |p| p.id } if @posts.any?
    citations = Citation.where(post_id: post_ids)
    citation_array = citations.map{ |c| c.generated_post_id }.uniq

    @cited_posts_count = Post.where(id: citation_array).size
  end

  def new
    @tag = Tag.new
  end

  def edit
  end

  def create
    @tag = Tag.find_or_create_by(text: tag_params[:text], user_id: tag_params[:user_id])

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
    if @tag.update(tag_params)
      respond_to do |format|
        format.html { redirect_to @tag }
        format.json { render json: TagSerializer.new(@tag).serializable_hash, status: :ok }
      end
    else
      respond_to do |format|
        format.html { redirect_to edit_tag_path(@tag) }
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  def add_tag
    if @post && @post.tags.include?(@tag)
      respond_to do |format|
        format.json { head :bad_request }
      end
    else
      if @post && (@post.tags << @tag) && @tag.save
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
  end

  def remove_tag
    if tag_params["deleted_at"]
      respond_to do |format|
        if @post.tags.delete(@tag) && @post.save
          format.html { head :ok }
          format.json { render json: { post: @post }, status: :ok }
        else
          format.html { head :ok }
          format.json { render json: @post.errors, status: :unprocessable_entity}
        end
      end
    end
  end

  def destroy
    @tag.destroy
    respond_to do |format|
      format.html { redirect_to root_path, status: :ok }
      format.json { head :ok }
    end
  end

  def paginated_posts
    respond_to do |format|
      if @tag.posts
        @posts = @tag.posts.order(created_at: :desc)
        @paginated_posts = @posts.paginate(page: params[:page], per_page: 10)
        format.json {
          render json: {
            posts: @paginated_posts,
            page: @paginated_posts.current_page,
            page_count: @paginated_posts.total_pages
          }
        }
      else
        format.json {
          render json: {
            status: 400,
            error: "No posts found"
          }
        }
      end
    end
  end

  def paginated_citations
    posts = @tag.posts.order(created_at: :desc)
    post_ids = posts.map{ |p| p.id }
    citations = Citation.where(post_id: post_ids)
    citation_array = citations.map{ |c| c.generated_post_id}.uniq

    @generated_posts = Post.where(id: citation_array)
      .order(created_at: :desc)
      .paginate(page: params[:page], per_page: 10)

    respond_to do |format|
      if @generated_posts
        format.json {
          render json: {
            posts: @generated_posts,
            page: @generated_posts.current_page,
            page_count: @generated_posts.total_pages
          }
        }
      else
        format.json { render json: @tag.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_tag
      id_or_slug = ( params[:id] || params[:slug] || params[:tag_id] || tag_params[:id] )
      @tag = Tag.find_by(slug: id_or_slug) || Tag.find_by(id: id_or_slug)
    end

    def set_target_post
      @post = Post.find_by(slug: params[:post_id]) if params[:post_id]
    end

    def tag_params
      params.require(:tag).permit(
        :id, :text, :slug, :post_id, :user_id, :deleted_at,
        :description
      )
    end

end
