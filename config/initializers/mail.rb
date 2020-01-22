if Rails.env.development?
	ActionMailer::Base.delivery_method = :letter_opener
	ActionMailer::Base.default_url_options = { host: 'localhost', port: '3000' }
	ActionMailer::Base.perform_deliveries = true

elsif Rails.env.staging?
	ActionMailer::Base.smtp_settings = {
		user_name: '43b827592a6196',
		password: 'e7f60dae46cd67',
		address: 'smtp.mailtrap.io',
		domain: 'smtp.mailtrap.io',
		port: '2525',
		authentication: :cram_md5
	}
end
