class PagesController < ApplicationController
	def index
    @posts = Post.last(3)
    @upload = Upload.new
	end
end
