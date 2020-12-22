module PostsHelper
  def meta_description(post)
    if post.abstract
      "#{meta_tag_sanitize_and_truncate(post.abstract)}"
    end
  end
  
  def meta_authors(post)
    if post.authors
      "#{post.authors.truncate(120)}"
    end
  end

  def meta_title(post)
    if post.title.present?
      "#{meta_tag_sanitize_and_truncate(post.title)}"
    end
  end

  def sanitize_title(title)
    Sanitize.fragment(title, :elements => ['b', 'sup', 'sub', 'em', 'code'])
  end

end
