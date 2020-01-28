class BroadcastPostsChannelWorker
  include Sidekiq::Worker

  def perform(post_id)
    # ActionCable.server.broadcast "posts_channel", content: "hello #{post_id}"
    # ActionCable.server.broadcast "posts_channel", content: "hello #{post_id}"

    @post = Post.find(post_id)
    serialized_post = PostSerializer.new(@post).serializable_hash
    PostsChannel.broadcast_to(@post, serialized_post)
  end
end
