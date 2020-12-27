require 'rails_helper'

RSpec.describe SearchController, type: :controller do

  describe "GET #results with no search query params" do
    it "returns http success" do
      get :results
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #results with valid search query params" do
    before { Post.create(title: "biology") }
    it "returns http success" do
      process :results, method: :get, params: { query: "biology" }
      expect(response).to have_http_status(:success)
    end
  end

end
