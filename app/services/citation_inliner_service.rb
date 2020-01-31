# class FiguresInlineService
# FiguresInlinerService.call(post_id)
# Inlines upload_images into the post body, or appends them to the end.
# TODO: develop strategy for replacing target based on caption text, labels, or etc

class CitationInlinerService

  def self.call(*args)
    new(*args).call
  end

  def initialize(post_id)
    @post = Post.find(post_id)
  end

  def call
    # inside the post, remove all <ref></ref> tags with nothing
    if @post.body
      new_body = @post.body
      @post.update!(body: new_body)
    end
  end

end
