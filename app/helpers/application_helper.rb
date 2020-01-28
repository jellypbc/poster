module ApplicationHelper

  def body_attributes
    user_attrs = current_user ? UserSerializer.new(current_user) : nil
    {
      'data-controller'   => controller_path.gsub('_', '-'),
      'data-action'       => action_name.gsub('_', '-'),
      'data-current-user' => user_attrs.to_json
    }
  end

end
