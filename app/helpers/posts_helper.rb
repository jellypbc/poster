module PostsHelper
  def meta_description(post)
    if post.title
      "#{post.title.truncate(120)}"
    end
  end

  def sanitize_title(title)
    Sanitize.clean(title)
    # Sanitize.clean(strip_tags(CGI.unescapeHTML(title.to_str))).truncate(length, separator: ' ')
  end

end
