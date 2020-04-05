class SearchRowSerializer
  include FastJsonapi::ObjectSerializer


  attribute :title do |object|
    if object.title.present?
      Sanitize.clean(object.title)
    elsif object.abstract && object.abstract.length > 0
      Sanitize.clean(object.abstract.truncate(50))
    else
      "No title"
    end
  end

  attribute :created_at do |object|
    object.created_at.strftime("%D")
  end

  link :post_url do |object|
    object.user_id? ? "/@#{object.user.username}/#{object.slug}" : "/posts/#{object.slug}"
  end

end
