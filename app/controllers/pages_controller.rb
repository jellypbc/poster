class PagesController < ApplicationController
	def index
    @posts = Post.primary
    	.last(3)
    	.reverse
    @upload = Upload.new
    if !user_signed_in?
      @no_header = true
    end
    @no_footer = true
	end
end
