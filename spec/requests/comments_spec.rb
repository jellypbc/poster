require 'rails_helper'

RSpec.describe "Comments", :type => :request do

  context "post" do
    let(:post) { create :post }
    let(:guest_user) { create :guest_user}

    it 'creates a model' do

      comment_params = {
        id: '1',
        comment: {
          text: "my comment",
          user_id: guest_user.id,
          post_id: post.id
        }
      }

      # post add_comment_url, method: :post, params: comment_params.as_json
      # post add_comment_url, params: comment_params
      binding.pry
      post add_comment_path, params: comment_params

      expect(response).to be_successful
    end
  end
end

