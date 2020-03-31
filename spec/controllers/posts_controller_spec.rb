require 'rails_helper'

RSpec.describe PostsController, type: :controller do
	render_views

  describe "GET #show" do

  	let(:post) { create :post }

  	it "assigns the requested @post to post" do
      expect {
       process :show, method: :get, params: { id: post.id }
      }.to change{ assigns(:post) }.to(post)
  	end

  	it "renders the :show template" do
      process :show, method: :get, params: { id: post.slug }
      expect(response).to render_template(:show)
    end
  end

end
