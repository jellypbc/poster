class PagesController < ApplicationController
	def index
    @posts = Post.primary
    	.last(3)
    	.reverse
    @upload = Upload.new
	end
end
