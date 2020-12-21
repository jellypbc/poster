module TagsHelper
  def tag_description(tag)
    if tag.posts.present?
      tag.posts.count > 1 ? "A collection of #{tag.posts.count} posts" : "A collection of one post"
    else
      "An empty collection"
    end
  end

  def tag_text(tag)
    if tag.text
      "#{meta_tag_sanitize_and_truncate(@tag.text)}"
    end
  end
end
