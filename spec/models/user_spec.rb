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

require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { User.new }

  describe ".to_param" do
    it "should return the username" do
      expect(user.to_param).to be user.username
    end
  end

  describe ".move_to" do
    let(:post) { create :post }
    let(:guest_user) { create :guest_user }
    let(:new_user) { create :user }

    before {
      Comment.create(data_key: "1", user_id: guest_user.id, post_id: post.id)
    }

    it "moves the comments to the new user" do
      guest_user.move_to(new_user)

      expect(new_user.comments.count).to eq(1)
      expect(guest_user.comments.count).to eq(0)
    end
  end

  describe ".set_username" do
    let(:user) { create :user, username: 'popping-jelly' }
    let(:new_user) { build :guest_user, full_name: 'popping jelly', username: 'popping-jelly' }

    before { user.username = "popping-jelly" }

    it 'with existing username is not valid' do
      expect(new_user).to_not be_valid
    end

    it "sets the sequence" do
      new_user.set_username
      expect(new_user.username).to eq("popping-jelly-2")
    end
  end

  describe "#confirm!" do

  end

end
