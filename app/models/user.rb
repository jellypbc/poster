# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  admin                  :boolean
#  avatar_data            :text
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  description            :string
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  failed_attempts        :integer          default(0), not null
#  full_name              :string
#  locked_at              :datetime
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  unconfirmed_email      :string
#  unlock_token           :string
#  username               :string           default(""), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

class User < ApplicationRecord
  include AvatarUploader::Attachment(:avatar)

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable

  before_save :set_username

  has_many :tags
  has_many :posts
  has_many :uploads
  has_many :follows, as: :follower

	def send_devise_notification(notification, *args)
		devise_mailer.send(notification, self, *args).deliver_later
	end

  def to_param
    username
  end

  def avatar_url(variant = nil)
    # see class AvatarUploader for variants
    if avatar
      super
    else
      ActionController::Base.helpers.asset_path "avatar.png"
    end
  end

  def has_avatar?
    avatar != nil
  end

  def process_avatars
    if previous_changes.keys.include?('avatar_data') && avatar_data.present?
      attacher = AvatarUploader::Attacher.from_model(self, :avatar)
      UserAvatarDerivativesWorker.perform_async(
        attacher.class.name,
        attacher.record.class.name,
        attacher.record.id,
        attacher.name,
        attacher.file_data,
      )
    end
  end

  private

    def set_username
      self.username = self.email[/^[^@]+/]
    end

end
