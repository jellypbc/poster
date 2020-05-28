class PostsChannel < ApplicationCable::Channel
  def subscribed
    post = Post.find params[:post_id]
    stream_for post, coder: ActiveSupport::JSON do |message|
      message['dog'] = "hi"
      transmit message
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
