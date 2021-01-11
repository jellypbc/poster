require 'rails_helper'

RSpec.describe "Tags", type: :request do

  let(:user) { create :user }
  let(:stubbed_post) { create :post }
  let(:valid_attributes) {
    {
      tag: {
        text: "biology tag",
        user_id: user.id,
        description: "This is a new tag"
      }
    }
  }

  describe "GET #show" do
    context "with param id" do
      let(:tag) { create :tag, user: user }
      it "assigns the tag" do
        get tag_path(tag)
        expect(assigns(:tag)).to eq(tag)
      end
    end
  end

  describe "POST #create" do
    context "with valid attributes" do
      context "when signed in" do

        before do
          sign_in user
        end

        it "creates a new tag" do
          expect {
            post tags_path, params: valid_attributes
          }.to change(Tag, :count).by(1)
        end
      end
    end
  end

  describe "PUT #update" do
    let(:tag) { create :tag, user: user }
    let(:format) { 'json' }

    context "when logged in" do
      before do
        sign_in user
      end

      context "as JSON" do
        it "updates the tag" do
          tag_params = {
            id: tag.slug,
            tag: {
              text: "chemistry tag"
            },
            format: format
          }
          patch tag_path(tag), params: tag_params
          expect(response).to have_http_status(:success)
          tag.reload
          expect(tag.text).to eq("chemistry tag")
        end
      end
    end
  end

  describe "DELETE #destroy" do
    let(:tag_params) {
      {
        text: "tag",
        user_id: user.id
      }
    }

    context "when logged in" do

      before { sign_in user }

      it "destroys the tag" do
        tag = Tag.create(tag_params)
        expect {
          delete tag_path(tag)
        }.to change(Tag, :count).by(-1)
      end
    end

    context "when logged out" do
      it "redirects" do
        tag = Tag.create(tag_params)
        delete tag_path(tag)
        expect(response).to have_http_status(302)
      end

    end
  end

  # tag and post exist
  describe "POST #add_tag" do
    let(:tag) { create :tag, user: user }
    let(:params) {
      {
        tag_id: tag.slug,
        post_id: stubbed_post.slug,
        format: 'json'
      }
    }

    context "when logged in" do
      context "with post params as JSON" do

        before { sign_in user }

        it "adds the tag from the post" do
          post post_add_tag_path(post_id: stubbed_post.slug), params: params
          tag.reload

          expect(response).to have_http_status(200)
          expect(tag.posts).to include(stubbed_post)
        end
      end

      context "with post already added to tag" do
      end

    end

    context "when logged out" do
      it "does not add the tag from the post" do
        post post_add_tag_path(post_id: stubbed_post.slug), params: params
        expect(response).to have_http_status(401)
      end
    end
  end

  describe "POST #remove_tag" do
    let(:tag) { create :tag, user: user }
    let(:params) {
      {
        tag_id: tag.slug,
        post_id: stubbed_post.slug,
        tag: {
          id: tag.id,
          deleted_at: true,
        },
        format: 'json'
      }
    }

    context "when logged in" do

      before { sign_in user }

      context "with valid params" do
        it "removes the tag from the post" do
          stubbed_post.tags << tag

          post post_remove_tag_path(post_id: stubbed_post.slug), params: params
          expect(response).to have_http_status(200)
          stubbed_post.reload
          tag.reload
          expect(stubbed_post.tags).to_not include(tag)
          expect(tag.posts).to_not include(stubbed_post)
        end
      end
    end
    context "when logged out" do
      it "does not remove the tag from the post" do
        post post_remove_tag_path(post_id: stubbed_post.slug), params: params
        expect(response).to have_http_status(401)
      end
    end
  end
end
