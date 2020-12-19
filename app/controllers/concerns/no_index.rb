module NoIndex
  extend ActiveSupport::Concern

  included do
    after_action :add_noindex_header_if_requested
  end

  def do_not_index!
    @_can_be_indexed = false
  end

  private

    def add_noindex_header_if_requested
      if @_can_be_indexed == false
        response.headers['X-Robots-Tag'] = 'noindex'
      end
    end
end
