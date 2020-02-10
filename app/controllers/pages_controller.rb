class PagesController < ApplicationController
	def index
    @posts = Post.primary
    	.last(3)
    	.reverse
    @upload = Upload.new

    @no_header = true
	end
end
