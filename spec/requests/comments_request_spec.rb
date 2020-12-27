require 'rails_helper'


RSpec.describe "Comments", :type => :request do

  describe "guest user commenting" do
    let(:post1) { create :post }

    xit 'creates a comment' do

      # 1. create a guest account
      expect {
        params = { user: { guest: true }, format: 'json' }
        post '/guestcreate', params: { user: { guest: true }, format: 'json' }
      }.to change{User.count}.by(1)

      guest_user = User.last
      expect(guest_user.guest).to eq(true)


      # 2. sign in guest account
      sign_in guest_user
      get post_path(post1)
      expect(controller.current_user).to eq(guest_user)
      expect(controller.current_user.guest).to eq(true)


      # 3. create a comment
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


      # 4. upgrade the guest account to full acount
      # TODO: fill out these params
      guest_user_params = {
        user: {
          id: guest_user.id,
          email: "email@email.com",
          username: "username",
          password: "password",
          password_confirmation: "password",
        },
        format: "json"
      }

      # TODO: fill out #move_to(new_user)
      expect {
        post upgrade_path, params: guest_user_params
      }.to change{ User.count }.by(1)

      new_user = User.last
      expect(new_user.comments.count).to eq(1)
      expect(new_user.guest).to eq(false)
      expect(Comment.last.user).to eq(new_user)

      # 5. delete a comment
      post "/remove_comment", params: { comment: { data_key: "1", user_id: new_user.id, deleted_at: true}, format: "json"}
      expect(new_user.comments.count).to eq(0)

    end
  end
end
