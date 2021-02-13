class PostsController < ApplicationController
  include NoIndex

  before_action :set_post, only: [:show, :edit, :update, :destroy, :set_post, :suggested_tags]
  before_action :authenticate_user!, only: [:edit, :update, :destroy]
  before_action :set_suggested_tags, only: [:edit]
  before_action :only_index_if_public, only: [:show]

  def show
  	@no_footer = true
  end

  def write
    @post = Post.new(body: "", visibility: "private")
    @post.user_id = current_user.id if current_user
    @post.save!

    if current_user
      redirect_to short_user_post_path(current_user, @post)
    else
      flash[:warning] = "You must be registered to view this page."
      redirect_to root_path
    end
  end

  def new
    @post = Post.new
  end

  def edit
    @no_footer = true
  end

  def create
    @post = Post.new(post_params)
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: 'Post was successfully created.' }
        format.json { render json: { redirect_to: post_url(@post), post: @post.as_json } }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @post.update!(post_params)
        update_comments(@post) if params[:comments]
        update_citations(@post) if params[:citations]
        update_authors(@post) if params[:author_id]

        serialized_post = PostSerializer.new(@post).as_json

        # BroadcastPostsChannelWorker.perform_async(@post.id)

        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render json: { post: serialized_post } }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if (@post.user == current_user) || (user_is_admin?)
      @post.deleted_at = Time.now
    end

    if @post.save!
      respond_to do |format|
        format.html { redirect_to dashboard_url, notice: 'Post was successfully destroyed.' }
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.html { redirect_to dashboard_url, notice: 'Something went wrong.' }
        format.json { head :no_content }
      end
    end

  end

  def add_figure
    @post = Post.find(params[:post_id])

    if params[:file_id]
      file = Shrine.uploaded_file(storage: :store, id: params[:file_id])
      file.refresh_metadata!

      # TODO: check file mimetype and only create for images
      figure = @post.figres.new
      figure.image_attacher.set(file)
    end

    respond_to do |format|
      if figure.save!
        format.json { render json: { url: figure.image_url }, status: :ok }
      else
        format.json { render json: { url: figure.errors }, status: :unprocessable_entity }
      end
    end
  end

  def suggested_tags
    respond_to do |format|
      format.json { render json: set_suggested_tags }
    end
  end

  def paginated_posts
    @posts = Post.all.primary.order(created_at: :desc)
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

  private

    def set_post
      id_or_slug = params[:slug] || params[:id] || params[:post_id]
      @post ||= begin
        Post.find_by!(slug: id_or_slug)
      rescue ActiveRecord::RecordNotFound => e
        # Lookup by old slug
        if (post = Post.lookup_by_slug(id_or_slug))
          post
        # If admin, attempt to lookup by id
        # elsif user_is_admin?
        else
          Post.find id_or_slug
          # raise e
        end
      end
    end

    def post_params
      params.require(:post).permit(
        :title, :body, :publisher, :authors, :abstract,
        :slug, :user_id, tags: [:id, :text, :post_id, :slug]
      )
    end

    def set_suggested_tags
      @suggested_tags = current_user.posts
        .primary
        .includes(:tags)
        .map(&:tags)
        .flatten
        .uniq
        .map{ |tag| {
          id: tag.id.to_s,
          text: tag.text,
          slug: tag.slug,
          color: tag.color,
        }}
        .as_json if current_user
    end

    def update_comments(post)
      if comments_data = JSON.parse(params['comments'])
        comments_data.each do |comment_data|
          comment = Comment.find_or_create_by(
            data_key: comment_data["id"].to_s,
            post_id: post.id
          )

          comment.update(
            text: comment_data["text"],
            data_from: comment_data["from"],
            data_to: comment_data["to"]
          )
        end
      end
    end

    def update_citations(post)
      if citations_data = JSON.parse(params['citations'])
        citations_data.each do |citation_data|
          citation = Citation.find_or_create_by(
            data_key: citation_data["id"].to_s,
            post_id: post.id
          )

          citation.update(
            title: citation_data["text"],
            data_from: citation_data["from"],
            data_to: citation_data["to"],
            highlighted_text: citation_data["highlightedText"]
          )
        end
      end
    end

    def update_authors(post)
      if author_id = JSON.parse(params['author_id']) && author = User.find_by_id(author_id)
        if (post.user != author)
          post.owners << author
        end
      end
    end

    def only_index_if_public
      do_not_index! if !@post.public_visibility?
    end


end
