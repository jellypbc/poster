require 'rails_helper'

RSpec.describe CommentsController, type: :controller do

  let(:post1) { create :post }
  let(:guest_user) { create :guest_user}
  let(:valid_attributes) {
    {
      text: "my comment",
      data_key: "1",
      user_id: guest_user.id,
      post_id: post1.id
    }
  }

  describe "GET #edit" do
    it "returns a success response" do
      comment = Comment.create! valid_attributes
      process :edit, method: :get, params: {id: comment.to_param}
      expect(response).to be_successful
    end
  end

  describe "POST #create" do
    context "when logged out" do
      context "with valid params" do
        it "returns a missing response" do
          process :create, method: :post, params: {comment: valid_attributes, format: 'json'}
          expect(response.content_type).to eq("application/json; charset=utf-8")
          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context "when logged in" do

      before do
        sign_in(guest_user)
      end

      context "with valid params" do
        it "creates a new Comment" do
          expect {
            process :create, method: :post, params: {comment: valid_attributes}
          }.to change(Comment, :count).by(1)
        end
      end
    end
  end

  describe "PUT #update" do

    context "with valid params" do

      before do
        sign_in(guest_user)
      end

      let(:new_attributes) {
        {
          data_key: "1",
          post_id: post1.id,
          text: "edited comment"
        }
      }

      it "updates the requested comment" do
        comment = Comment.create! valid_attributes
        process :update, method: :put, params: {id: comment.to_param, comment: new_attributes}
        comment.reload
        expect(comment.text).to eq("edited comment")
      end
    end
  end

  describe "DELETE #delete" do
    before do
      sign_in(guest_user)
    end

    it "sets deleted_at on the requested comment" do
      comment = Comment.create! valid_attributes
      params = {id: comment.to_param, comment: { id: comment.id, data_key: comment.data_key, deleted_at: true }}
      process :delete, method: :post, params: params
      comment.reload
      expect(comment.deleted_at).not_to be_nil
    end
  end

end
