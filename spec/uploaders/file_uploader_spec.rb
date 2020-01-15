require 'rails_helper'

RSpec.describe FileUploader do
	def uploaded_file(metadata = {})
		Shrine.uploaded_file(
			"id"       => "123",
			"storage"  => "cache",
			"metadata" => {"mime_type" => "application/pdf", "size" => 100}.merge(metadata)
		)
	end

	let(:upload) do
		FactoryBot.build(:upload, file: uploaded_file(metadata).to_json)
	end

	let(:metadata) { Hash.new }

	describe "validations" do
		before(:each) { upload.valid? }

		context "when file is correct" do
			xit "passes" do
				expect(upload.errors).to be_empty
			end
		end

		context "when extension is correct but MIME types isn't" do
			let(:metadata) { Hash["filename" => "article.pdf", "mime_type" => "text/plain"] }

			xit "fails" do
				expect(upload.errors[:file].to_s).to include("isn't of allowed type")
			end
		end

		context "when file is larger than 10MB" do
			let(:metadata) { Hash["size" => 11 * 1024 * 1024] }

			xit "fails" do
				expect(upload.errors[:file].to_s).to include("too large")
			end
		end
	end
end
