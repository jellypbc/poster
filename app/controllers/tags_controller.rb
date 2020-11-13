class TagsController < ApplicationController
  before_action :set_tag, only: [:show, :edit, :update, :destroy]
  before_action :set_post, only: [:show, :create, :edit, :update, :destroy]

  def show
    @posts = @tag.posts
      .order(created_at: :desc)
      .paginate(page: params[:posts_page], per_page: 10)


    @post_ids = @posts.map{ |p| p.id}

    @citations = Citation.where(post_id: @post_ids)

    citation_array = @citations
      .map{ |c| c.generated_post_id}
      .uniq

    @generated_posts = Post.where(id: citation_array)
      .order(created_at: :desc)
      .paginate(page: params[:citations_page], per_page: 10)

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

  def paginated_posts
    @tag = Tag.find params[:id]
    if @tag.posts
      @posts = @tag.posts.order(created_at: :desc)
      @paginated_posts = @posts.paginate(page: params[:page], per_page: 10)
      respond_to do |format|
        format.json {
          render json: {
            posts: @paginated_posts,
            page: @paginated_posts.current_page,
            page_count: @paginated_posts.total_pages
          }
        }
      end
    end
  end

  def paginated_citations
    @tag = Tag.find params[:id]
    if @tag.posts
      @posts = @tag.posts
        .order(created_at: :desc)
        .paginate(page: params[:posts_page], per_page: 10)


      post_ids = @posts.map{ |p| p.id}

      @citations = Citation.where(post_id: post_ids)

      citation_array = @citations
        .map{ |c| c.generated_post_id}
        .uniq

      @generated_posts = Post.where(id: @citation_array)
        .order(created_at: :desc)
        .paginate(page: params[:citations_page], per_page: 10)

      respond_to do |format|
        format.json {
          render json: {
            posts: @generated_posts,
            page: @generated_posts.current_page,
            page_count: @generated_posts.total_pages
          }
        }
      end
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
