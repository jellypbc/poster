require 'rails_helper'

RSpec.describe "Comments", type: :request do

  describe "post" do
    let(:thing) { create :post }
    let(:guest_user) { create :guest_user}

    it 'creates a model' do

      comment_params = {
        id: '1',
        comment: {
          text: "my comment",
          user_id: guest_user.id,
          post_id: thing.id
        }
      }

      post '/add_comment', params: comment_params
      # post :comments, params: comment_params

      # binding.pry
      # process '/add_comment', method: :post, params: comment_params

      expect(response).to be_successful
    end
  end
end

