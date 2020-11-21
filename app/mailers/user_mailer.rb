class UserMailer < ApplicationMailer
	layout 'mailer'

  def welcome(user_id)
    @user = User.find user_id
    mail to: @user.email, subject: 'Welcome!'
  end

end
