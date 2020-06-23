class StyleguideController < ApplicationController
  def show
    @user = User.new(full_name: "Denny")
    @post = Post.primary.last
    @posts = Post.paginate(:page => params[:page], :per_page => 1)
    @user.valid? # to get errors
  end
end
