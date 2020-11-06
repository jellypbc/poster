module PostsHelper
  def meta_description(post)
    if post.authors
      "#{post.authors.truncate(120)}"
    end
  end

  def sanitize_title(title)
    Sanitize.fragment(title, :elements => ['b', 'sup', 'sub', 'em', 'code'])
  end

end
