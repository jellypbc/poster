class PagesController < ApplicationController
	def index
    @posts = Post.primary.last(3)
    @upload = Upload.new
	end
end
