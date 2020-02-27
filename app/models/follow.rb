# == Schema Information
#
# Table name: follows
#
#  id             :bigint           not null, primary key
#  target_user_id :integer          not null
#  user_id        :integer          not null
#
# Indexes
#
#  index_follows_on_user_id_and_target_user_id  (user_id,target_user_id) UNIQUE
#

class Follow < ApplicationRecord
end
