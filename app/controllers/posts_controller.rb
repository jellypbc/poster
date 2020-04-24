class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy, :set_post, :suggested_tags]
  before_action :authenticate_user!, only: [:destroy, :set_post, :suggested_tags]
  before_action :set_suggested_tags, only: [:edit]

  def index
    @posts = Post.primary
      .order(created_at: :desc)
      .paginate(page: params[:page], per_page: 40)
  end

  def show
  	@no_footer = true
  end

  def write
    @post = Post.new(body: "")
    @post.user_id = current_user.id if current_user
    @post.save!

    if current_user
      redirect_to short_user_post_path(current_user, @post)
    else
      redirect_to post_path(@post)
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
        format.json { render json: { redirect_to: post_url(@post) } }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    # binding.pry
    respond_to do |format|
      if @post.update!(post_params)

        if params[:comment_state]

        end
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render json: { post: PostSerializer.new(@post).as_json } }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
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

  private

    def set_post
      id_or_slug = params[:slug] || params[:id] || params[:post_id]
      @post ||= begin
        Post.find_by! slug: id_or_slug
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
        :title, :body, :publisher, :authors,
        :slug, tags: [:id, :text, :post_id, :slug]
      )
    end

    def set_suggested_tags
      @suggested_tags = current_user.posts
        .primary
        .includes(:tags)
        .map(&:tags)
        .flatten
        .uniq
        .select{|tag| tag.post_id != @post.id }
        .map{ |tag| {
          id: tag.id.to_s,
          text: tag.text,
          slug: tag.slug,
          color: tag.color,
        }}
        .as_json
      end

end
