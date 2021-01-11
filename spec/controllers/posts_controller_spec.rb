require 'rails_helper'

RSpec.describe PostsController, type: :controller do
	render_views

  describe "GET #show" do

  	let(:stubbed_post) { create :post }

  	it "assigns the requested @post to post" do
      expect {
       process :show, method: :get, params: { id: stubbed_post.id }
      }.to change{ assigns(:post) }.to(stubbed_post)
  	end

  	it "renders the :show template" do
      process :show, method: :get, params: { id: stubbed_post.slug }
      expect(response).to render_template(:show)
    end
  end

  describe "POST #delete" do
    let(:user) { create :user }
    let(:admin) { create :admin }
    let(:other_user) { create :user }
    let(:stubbed_post) { create :post, user: user }


    context 'when the user owns the post' do
      before do
        sign_in user
      end

      it 'sets deleted_at' do
        post :destroy, params: { id: stubbed_post.id }
        stubbed_post.reload
        expect(stubbed_post.deleted_at).not_to be_nil
      end
    end

    context 'when the user doesnt own the post' do
      before do
        sign_in other_user
      end

      it 'does not set deleted_at' do
        post :destroy, params: { id: stubbed_post.id }
        stubbed_post.reload
        expect(stubbed_post.deleted_at).to be_nil
      end
    end

    context 'when the user is admin' do
      before do
        sign_in admin
      end

      it 'it sets deleted_at' do
        post :destroy, params: { id: stubbed_post.id }
        stubbed_post.reload
        expect(stubbed_post.deleted_at).not_to be_nil
      end
    end

    context 'when logged out' do
      it 'should redirect' do
        post :destroy, params: { id: stubbed_post.id }
        expect(response.code).to eq("302")
      end
    end

  end
end
