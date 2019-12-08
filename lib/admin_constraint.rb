class AdminConstraint
  def matches?(request)
    (token = request.cookies.remember_token) &&
      (user = User.find_by remember_token: token) &&
        user.admin?
  rescue
    false
  end
end
