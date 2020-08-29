module Admin
  class TagsController < ApplicationController
    before_action :admin_only

    def show
    end

    def index
      @tags = Tag.all
    end

  end
end
  