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

class UserSerializer
  include FastJsonapi::ObjectSerializer
  include Rails.application.routes.url_helpers

  include UsersHelper

  # From model
  attributes :id, :email, :username, :admin

  attribute :avatar_url do |object|
    object.avatar_url
  end

  attribute :full_name do |object|
    object.full_name.present? ? object.full_name : object.username
  end

  attribute :posts do |object|
    object.posts.pluck([:id, :title, :slug])
  end

end
