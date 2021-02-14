module TagsHelper

  def tag_description(username)
    "A collection created by @#{username}"
  end

  def tag_text(text)
    if text
      "#{meta_tag_sanitize_and_truncate(text)}"
    end
  end
end
