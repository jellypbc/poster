require 'rails_helper'
RSpec.describe UsersController, type: :controller do
  render_views
  let(:valid_attributes) {
    {
      email: "hi@hi.com",
      password: "dogdogdog",
      password_confirmation: "dogdogdog",
      username: "dogdog"
    }
  }
  # describe "GET #show" do
  #   let(:user) { create :user }
  #   it "assigns the requested @user to user" do
  #     expect {
  #      process :show, method: :get, params: { id: user.id }
  #     }.to change{ assigns(:user) }.to(user)
  #   end
  #   it "renders the :show template" do
  #     process :show, method: :get, params: { id: user.id }
  #     expect(response).to render_template(:show)
  #   end
  # end

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