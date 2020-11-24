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
#  guest                  :boolean          default(FALSE)
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

  VALID_EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
  VALID_USERNAME_REGEX = /\A[0-9a-z_-]+\z/i

  ADJECTIVE = %w(chocolate melon savory grass coffee popping grape berry clear flavorful molded peanut plum spicy cheddar almond tomato sparkling)
  NOUN =  %w(aspic jelly jello jam pudding agar gelatin tapioca gel pannacotta tofu)

  # validates :description, length: 300

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable

  before_create :downcase_email
  before_create :set_username

  validates :username, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 50 }, format: {with: VALID_USERNAME_REGEX, message: 'no special characters, only letters and numbers' }
  validates_format_of :username, with: /^[a-zA-Z0-9_\-\.]*$/, :multiline => true

  has_many :tags
  has_many :posts
  has_many :comments
  has_many :uploads
  has_many :follows, as: :follower

  attr_writer :login

  def to_param
    username
  end

  def login
    @login || self.username || self.email
  end

  def self.find_first_by_auth_conditions(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
    else
      if conditions[:username].nil?
        where(conditions).first
      else
        where(username: conditions[:username]).first
      end
    end
  end

	def send_devise_notification(notification, *args)
		devise_mailer.send(notification, self, *args).deliver_later
	end

  def move_to(user)
    comments.update_all(user_id: user.id)
  end

  def avatar_url(variant = nil)
    # see class AvatarUploader for variants
    if avatar
      super
    else
      User.default_avatar_url
    end
  end

  def self.default_avatar_url
    ActionController::Base.helpers.asset_path "avatar.png"
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

  def downcase_email
    email.downcase! if email
  end

  def generate_jelly_name
    self.full_name = (ADJECTIVE.sample + " " + NOUN.sample).titleize
  end

  def set_username
    if guest
      generate_jelly_name if full_name.blank?
      pending_username = full_name.parameterize
      if self.class.where("username=?", pending_username).any?
        sequence = self.class.where("username like '#{pending_username}-%'").count + 2
        pending_username = "#{pending_username}-#{sequence}"
      end
      self.username = pending_username
    else
      self.username = email[/^[^@]+/].tr('.','') if username.blank?
    end
  end

  private

end
