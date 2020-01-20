# Requires Slugged

module SlugHistory
  extend ActiveSupport::Concern

  module ClassMethods
    def remember_slug
      after_save_commit :save_slug_if_changed
    end

    def lookup_by_slug(slug)
      if (object_id = $redis.GET(slug_history_key(slug)))
        return find(object_id)
      end
    end

    def slug_history_key(slug)
      "slug_history:#{to_s}:#{slug}"
    end
  end

  private

    # Check that slug_attribute (defined by Slugged) was changed
    def save_slug_if_changed
      if previous_changes.keys.include? slug_source.to_s
        self.set_slug!
        save_slug! read_attribute(slug_attribute)
      end

      if previous_changes.keys.include? slug_attribute.to_s
        save_slug! read_attribute(slug_attribute)
      end
    end

    def save_slug!(slug)
      $redis.SET self.class.slug_history_key(slug), id
    end
end
