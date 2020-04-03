class SearchController < ApplicationController
  def results
    @results = Post.search(params[:query], page: params[:page], per_page: 20)
  end
end
