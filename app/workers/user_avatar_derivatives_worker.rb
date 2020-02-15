class UserAvatarDerivativesWorker
  include Sidekiq::Worker

  def perform(attacher_class, record_class, record_id, name, file_data)
    attacher_class = Object.const_get(attacher_class)
    record         = Object.const_get(record_class).find(record_id) # if using Active Record
    attacher = attacher_class.retrieve(model: record, name: name, file: file_data)
    attacher.create_derivatives # calls derivatives processor
    attacher.atomic_persist
  rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
    attacher&.destroy_attached # delete now orphaned derivatives
  end
end
