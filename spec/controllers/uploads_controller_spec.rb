require 'rails_helper'

RSpec.describe UploadsController, type: :controller do
  render_views

  describe "GET #show" do

    let(:upload) { create :upload }

    it "assigns the requested @upload to upload" do
      expect {
       process :show, method: :get, params: { id: upload.id }
      }.to change{ assigns(:upload) }.to(upload)
    end

    it "renders the :show template" do
      process :show, method: :get, params: { id: upload.id }
      expect(response).to render_template(:show)
    end
  end

  describe "GET #edit" do
  end

end
