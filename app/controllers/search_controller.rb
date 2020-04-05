class SearchController < ApplicationController
  def results
    # binding.pry
    @results = Post.search(params[:query], page: params[:page], per_page: 20)
  end

  def bar
    query_from_client = params[:query]
    results = Post.search(query_from_client, limit: 5)
    serialized_results = results.map{|r| SearchRowSerializer.new(r).serializable_hash}
    render json: serialized_results
  end
end
