class BroadcastPostsChannelWorker
  include Sidekiq::Worker

  def perform(post_id)
    @post = Post.find(post_id)
    serialized_post = @post.serialize
    PostsChannel.broadcast_to(@post, serialized_post)
  end
end
