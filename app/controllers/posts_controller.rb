class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.primary
      .order(created_at: :desc)
      .paginate(page: params[:page], per_page: 40)
  end

  def show
  	@no_footer = true
  end

  def new
    @post = Post.new
  end

  def edit
  	@no_footer = true
  end

  def create
    @post = Post.new(post_params)

    if signed_in?
      @post.user_id = current_user.id
    end

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
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { render json: { redirect_to: post_url(@post) } }
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
        :slug, :plugins
      )
    end
end
