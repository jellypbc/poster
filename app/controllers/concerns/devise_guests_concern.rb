module DeviseGuestsConcern
  extend ActiveSupport::Concern

  def guest_user
    return @guest_user if @guest_user

    if session[:guest_user_id]
      @guest_user = User.find_by(User.authentication_keys.first => session[:guest_user_id]) rescue nil
      @guest_user = nil if @guest_user.respond_to? :guest and !@guest_user.guest
    end

    @guest_user ||= begin
      u = create_guest_user(session[:guest_user_id])
      session[:guest_user_id] = u.send(User.authentication_keys.first)
      u
    end

    @guest_user
  end

  def current_or_guest_user
    if current_user
      if session[:guest_user_id]
        run_callbacks :logging_in_user do
          guest_user.destroy
          session[:guest_user_id] = nil
        end
      end
      current_user
    else
      guest_user
    end
  end

  private

  def create_guest_user key = nil
    auth_key = User.authentication_keys.first
    User.new do |g|
      g.username = guest_email_authentication_key key
      g.email = guest_email_authentication_key key
      g.guest = true if g.respond_to? :guest
      g.skip_confirmation! if g.respond_to?(:skip_confirmation!)
      g.save(validate: false)
    end
  end

  def guest_email_authentication_key key
    key &&= nil unless key.to_s.match(/^guest/)
    key ||= "guest_" + guest_user_unique_suffix + "@example.com"
  end

  def guest_user_unique_suffix
    Devise.friendly_token + "_" + Time.now.to_i.to_s + "_" + unique_user_counter.to_s
  end

  def unique_user_counter
    @@unique_user_counter ||= 0
    @@unique_user_counter += 1
  end

end
