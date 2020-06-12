require 'rails_helper'

RSpec.describe "Comments", :type => :request do

  describe "creating a new comment" do
    let!(:post) { create :post }

    context "when logged out" do
      # xit "comment assigned to guest" do
        # create a comment
        # expect(response).to #comments user is user
      # end
    end

    context "when logged in" do

      let(:guest_user) { create :guest_user}

      context "as a guest" do

        it "comments assigned to account" do

          comment_params = {
            comment: {
              text: "comment",
              user_id: guest_user.id,
              post_id: post.id
            }
          }
          headers = { "ACCEPT" => "application/json" }

          # binding.pry
          expect {
            post "add_comment", params: comment_params
          }.to change(Comment, :count).by(1)
          # post "#{post.slug}/add_comment", :params => comment_params, :headers => headers
          # post comments_path, params: comment_params

          expect(response).to have_http_status(:ok)

          comment = Comment.last
        end

        # it "the last comment should have a user" do
        #   comment.user.should_not be nil
        # end

        # it "the user of the comment should be a guest" do
        #   comment.user.guest.should equal(true)
        # end

          # comment = guest_user.comments.create! user: guest_user, text: 'comment', post: post

          # guest_user.comments.size.should equal(1) #account has comments


        # xit 'upgrade guest to full account' do
          #
        # end
      end

      context "as a user" do
        # xit "creates a comment" do
        # end
      end
    end
  end

  # describe "deleting a comment" do
  #   context "when logged in as a guest" do
  #     # let { :guest_user }
  #   end
  #   context "when logged in as a full user" do
  #     # let { :user }
  #   end
  # end
end

