class BroadcastPostsChannelWorker
  include Sidekiq::Worker

  def perform(post_id)
    ActionCable.server.broadcast "posts_channel", content: "hello #{post_id}"
  end
end
