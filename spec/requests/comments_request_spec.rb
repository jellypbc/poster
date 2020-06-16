require 'rails_helper'

RSpec.describe "Comments", type: :request do

  # TESTS TODOS
  # visit a post
  # create a guest account
  # create a comment
  # upgrade account
  # delete the comment

  describe "post" do
    let(:thing) { create :post }
    let(:guest_user) { create :guest_user}

    xit 'creates a model' do

      comment_params = {
        id: '1',
        comment: {
          text: "my comment",
          user_id: guest_user.id,
          post_id: thing.id
        }
      }

      post '/add_comment', params: comment_params

    end
  end
end

