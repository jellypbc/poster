class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :edit, :update, :delete]
  before_action :set_post, only: [:show, :create, :edit, :update, :delete]
  skip_before_action :verify_authenticity_token

  def index
    @comments = Comment.all
  end

  def show
  end

  def new
    @comment = Comment.new
  end

  def edit
  end

  def create

    # if someone is logged in
    # comment_params = {
    #   comment: {
    #     user_id: "cindywu"
    #   }
    # }

    # if they are not logged in
    # comment_params = {
    #   comment: {
    #     user_id: nil
    #   }
    # }


    # comment_params will contain user_id

    @user = User.find (comment_params.user_id)
    @comment.user = @user

    @comment = Comment.new(comment_params)
    # if current_user?
      # continue
    # else
      # create a new user where guest is true
      # set comment.user to new user
      # log-in new user
      # continue

    respond_to do |format|
      if @comment.save
        format.html { head :ok }
        format.json { render json: { comment: @comment.as_json } }
      else
        format.html { render :new }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @comment.update(comment_params)
        format.html { redirect_to @comment, notice: 'Comment was successfully updated.' }
        format.json { render :show, status: :ok, location: @comment }
      else
        format.html { render :edit }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  def delete
    @comment.delete_now if comment_params["deleted_at"]
    respond_to do |format|
      if @comment.save
        format.json { render json: { comment: @comment }, status: :ok  }
      else
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_comment
      id_or_data_key = comment_params[:data_key].to_s || params[:id].to_s
      @comment ||= begin
        Comment.find_by! data_key: id_or_data_key
      rescue ActiveRecord::RecordNotFound => e
        Comment.find id_or_data_key
      end
    end

    def set_post
      if params[:comment] && params[:comment][:post_id]
        @post = Post.find(params[:comment][:post_id])
      end
    end

    def comment_params
      params.require(:comment).permit(
        :text, :data_to, :data_from, :data_key,
        :user_id, :post_id, :deleted_at, :field_type
      )
    end

end
