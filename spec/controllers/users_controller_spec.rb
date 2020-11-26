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

  context "as HTML" do
    let(:format) { 'html' }

    shared_examples 'common response characteristics' do
      it 'returns http success' do
        expect(response).to have_http_status(200)
      end

      it 'renders show template' do
        expect(response).to render_template(:show)
      end
    end

    describe "GET #show" do
      let(:user) { create :user }

      it_behaves_like 'common response characteristics'

      before do
        process :show, method: :get, params: { id: user.to_param, format: format }
      end

      context do
        it "renders the :show template" do
          expect(response).to render_template(:show)
        end
      end
    end
  end

  context "as JSON" do
    let(:format) { 'json' }

    describe "POST #create" do
      context "when logged out" do
        context "with valid params" do
          it "returns a successful response" do
            process :create, method: :post, params: {user: valid_attributes, format: format }
            expect(response.content_type).to eq("application/json; charset=utf-8")
            expect(response).to have_http_status(:success)
          end
        end

        context "with guest params" do
          subject {
            process :create, method: :post, params: { user: { guest: true }, format: format }
          }

          it "returns a successful response" do
            expect(subject.content_type).to eq("application/json; charset=utf-8")
            expect(subject).to have_http_status(:success)
          end

          it "returns a guest user" do
            parsed = JSON.parse subject.body
            expect(parsed).to have_key("data")
            expect(parsed.dig("data", "attributes", "guest")).to eq(true)
          end
        end
      end
    end
  end
end
