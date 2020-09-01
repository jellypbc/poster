module PostsHelper
  def meta_description(post)
    if post.title
      "#{post.title.truncate(120)}"
    end
  end

  def sanitize_title(title)
    Sanitize.fragment(title, :elements => ['b', 'sup', 'sub', 'em', 'code'])
  end

end
