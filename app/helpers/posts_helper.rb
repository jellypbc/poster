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


  def upload_html(file, userId)
  	file = File.open(file)
  	# turns file path into title
  	title = file.sub(/^.*[\\\/]/, '').sub('.html','')
  	newPost = Post.new
  	newPost.title = title
  	newPost.body = file.read
  	newPost.user = userId
  end

end
