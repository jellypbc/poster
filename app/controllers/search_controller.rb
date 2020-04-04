class SearchController < ApplicationController
  def results
    @results = Post.search(params[:query], page: params[:page], per_page: 20)
  end

  def bar
    # binding.pry
    query_from_client = params[:query]

    @results = Post.search(query_from_client)
    render json: @results.as_json
  end
end
