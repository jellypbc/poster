require 'rails_helper'
RSpec.describe "Comments", type: :request do
  # TESTS TODOS
  # visit a post
  # create a guest account
  # create a comment
  # upgrade account
  # delete the comment

  describe "guest user commenting" do
    let(:post1) { create :post }
    # let(:guest_user) { create :guest_user }

    it 'creates a comment' do

      get post_path(post1)

      expect {
        post users_path, params: { user: { guest: true } }
      }.to change{User.count}.by(1)

      guest_user = User.last
      expect(guest_user.guest).to eq(true)

      get authenticated_root_path
      expect(controller.current_user).to eq(guest_user)

      comment_params = {
        comment: {
          text: "my comment",
          data_key: "1",
          user_id: guest_user.id,
          post_id: post1.id
        },
        format: 'json'
      }

      expect{
        post "/add_comment", params: comment_params
      }.to change{ Comment.count }.by(1)

      # # TODO: fill out these params
      guest_user_params = {
        user: {
          email: "email@email.com",
          username: "username",
          password: "password",
          password_confirmation: "password_confirmation",
        }
      }

      # # TODO: fill out #move_to(new_user)
      expect {
        post users_path, params: guest_user_params
      }.to change{ User.count }.by(1)

      expect(new_user.comments.count).to eq(1)
      expect(new_user.guest).to eq(false)
      expect(Comment.last.user).to eq(new_user)

      expect {
        post "/remove_comment", params: comment_params
      }.to change { Comment.count }.by(1)
      expect(new_user.comments.count).to eq(0)

    end
  end
end