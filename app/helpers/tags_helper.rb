module TagsHelper
  def tag_description(username)
    "A collection created by @#{@username}"
  end

  def tag_text(tag)
    if tag.text
      "#{meta_tag_sanitize_and_truncate(@tag.text)}"
    end
  end
end
