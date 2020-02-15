class UserAvatarDerivativesWorker
  include Sidekiq::Worker

  # def perform(user_id)
  #   user = User.find user_id
  #   user.avatar_derivatives!

  #   puts ">>> HELLLOOOO !!!!!"
  # end


  def perform(attacher_class, record_class, record_id, name, file_data)
    attacher_class = Object.const_get(attacher_class)
    record         = Object.const_get(record_class).find(record_id) # if using Active Record
    # binding.pry
    # AvatarUploader::Attacher.retrieve(User.last, 'avatar', file: User.last.avatar.file_data)
    attacher = attacher_class.retrieve(model: record, name: name, file: file_data)
    attacher.create_derivatives # calls derivatives processor
    attacher.atomic_persist
  rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
    attacher&.destroy_attached # delete now orphaned derivatives
  end
end
