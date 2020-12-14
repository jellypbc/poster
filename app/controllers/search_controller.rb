class SearchController < ApplicationController
  def results
    @results = Post.search(params[:query], page: params[:page], per_page: 10)
  end

  def paginated_results
    @paginated_results = Post.search(params[:query], page: params[:page], per_page: 10)
    respond_to do |format|
      format.json {
        render json: {
          posts: @paginated_results,
          page: @paginated_results.current_page,
          page_count: @paginated_results.total_pages
        }
      }
    end
  end

  def bar
    query_from_client = params[:query]
    results = Post.search(query_from_client, limit: 5)
    serialized_results = results.map{|r| SearchRowSerializer.new(r).serializable_hash}
    render json: serialized_results
  end
end
