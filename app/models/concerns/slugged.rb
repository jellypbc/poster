module Slugged
  extend ActiveSupport::Concern

  BLACKLIST = %w(new edit destroy update posts post)

  module ClassMethods
    attr_reader :_slug_source # The attribute to use as slug source
    attr_reader :_slug_attr   # The attribute to write slug to

    def slug(source, opts = {})
      @_slug_source = source
      @_slug_attr = opts[:attribute] || nil

      include InstanceMethods

      # Ensure slug attribute is present and unique
      validates _slug_attr, presence: true,
        uniqueness: { case_sensitive: false }
      validate :allowed_slug

      before_validation :set_placeholder_slug, on: :create
    end
  end

  module InstanceMethods

    def set_slug!
      write_attribute slug_attribute, generate_slug
      save!
    end

    # private

      def allowed_slug
        if BLACKLIST.include? send(slug_attribute)
          errors.add slug_attribute, 'This slug is unavailable'
        end
      end

      def set_placeholder_slug
        unless read_attribute(slug_attribute)
          placeholder = (0...6).map{(65+rand(26)).chr}.join.downcase
          write_attribute slug_attribute, placeholder
        end
      end

      def slug_source
        self.class._slug_source
      end

      def slug_attribute
        self.class._slug_attr
      end

      def munged_source
        source = send slug_source
        ActionController::Base.helpers.strip_tags(source).parameterize
      end

      def generate_slug
        slug_attr = send slug_attribute
        if slug_attr
          pending_slug = slug_attr.slice(0..5)
        end

        if munged_source.present?
          pending_slug += "-" + munged_source
        end

        if self.class.where("#{slug_attribute}=?", pending_slug).any?
          sequence = self.class.where("#{slug_attribute} like '#{pending_slug}-%'").count + 2
          pending_slug = "#{pending_slug}-#{sequence}"
        end

        pending_slug
      end
  end
end
