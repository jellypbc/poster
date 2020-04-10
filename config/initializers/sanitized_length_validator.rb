ActiveRecord::Base.class_eval do
  def self.validates_sanitized_string_length(*attr_names)
    options = attr_names.extract_options!
    validates_each(attr_names, options) do |record, attribute, value|
      next if value == nil
      value = ActionController::Base.helpers.strip_tags(value.gsub(/[\r|\t|\n]/, '')).strip
      record.errors[attribute] << "is too long. The maximum length is #{options[:length]} " if value.length > options[:length]
    end
  end
end