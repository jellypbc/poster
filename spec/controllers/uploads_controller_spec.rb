require 'rails_helper'

RSpec.describe UploadsController, type: :controller do
	render_views

	describe "GET #show" do

		let(:upload) { create :upload }

		it "assigns the requested @upload to upload" do
			process :show, method: :get, params: { id: upload.id }
			assigns(:upload).should eq(upload)
		end

		it "renders the :show template" do
			process :show, method: :get, params: { id: upload.id }
			response.should render_template :show
		end
	end

  describe "GET #edit" do
  end

end
