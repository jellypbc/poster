module ApplicationHelper

  def full_title(page_title)
    base_title = "Jelly Poster"

    if page_title.empty?
      base_title
    elsif current_page?(root_path)
      strip_tags("#{base_title} | #{page_title}").html_safe
    else
      strip_tags("#{page_title} | #{base_title}").html_safe
    end
  end

  def meta_tag_sanitize_and_truncate(text, length = 300)
    # Look I don't know why we need both Santize and strip_tags. But try only
    # including one and you will see the tags when you inspect the link through https://developers.facebook.com/tools/debug/sharing
    # When you don't use CGI.unescapeHTML you get this shit &lt;p&gt;The goal is to examine...
    # When you don't do text.to_str you get can't dup NilClass see https://github.com/rails/rails/issues/12672
    Sanitize.clean(strip_tags(CGI.unescapeHTML(text.to_str))).truncate(length, separator: ' ')
  end

  def body_attributes
    user_attrs = current_user ? UserSerializer.new(current_user) : nil
    {
      'data-controller'   => controller_path.gsub('_', '-'),
      'data-action'       => action_name.gsub('_', '-'),
      'data-current-user' => user_attrs.to_json
    }
  end

end
