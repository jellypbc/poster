require 'rails_helper'
RSpec.describe UsersController, type: :controller do
  render_views
  let(:valid_attributes) {
    {
      email: "hello@jellypbc.com",
      password: "password",
      password_confirmation: "password",
      username: "jellyuser"
    }
  }

  # describe "GET #index" do
  #   context "when logged in as admin" do
  #     let(:admin) { create :admin }

  #     before { sign_in admin }

  #     it "renders the :show template" do
  #       process :index, method: :get
  #       expect(response).to render_template(:index)
  #     end
  #   end
  #   context "when logged out" do
  #     it "redirects" do
  #       process :index, method: :get
  #       expect(response).to have_http_status(:found)
  #     end
  #   end
  # end

  describe "GET #show" do
    let(:user) { create :user }
    it "renders the :show template" do
      process :show, method: :get, params: { id: user.to_param }
      expect(response).to render_template(:show)
    end
  end

  describe "POST #create" do
    context "when logged out" do
      context "with valid params" do
        it "returns a successful response" do
          process :create, method: :post, params: {user: valid_attributes, format: 'json' }
          expect(response.content_type).to eq("application/json; charset=utf-8")
          expect(response).to have_http_status(:success)
        end
      end

      context "with guest params" do
        it "returns a successful response" do
          process :create, method: :post, params: { user: { guest: true }, format: 'json' }
          expect(response.content_type).to eq("application/json; charset=utf-8")
          expect(response).to have_http_status(:success)
        end
      end
    end
  end
end
