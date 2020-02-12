module PostsHelper
  def meta_description(post)
    "#{post.title.truncate(120)} | #{post.abstract.truncate(300)}"
  end

end
