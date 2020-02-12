module PostsHelper
  def meta_description(post)
    if post.title
      "#{post.title.truncate(120)}"
    end
  end

end
