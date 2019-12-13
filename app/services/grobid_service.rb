# class GrobidService
# This service object handles an upload object that is a pdf

class GrobidService
	require 'open-uri'

	# In dev, make sure you have grobid running on 8070 or change this line below
	GROBID_HOST = ENV['GROBID_URL'] || "http://localhost:8070"

	# Here are some sample grobid tasks from grobid service
	GROBID_ENDPOINTS = {
		full: "processFulltextDocument",
		header: "processHeaderDocument",
		asset: "processFulltextAssetDocument"
	}

	def self.call(*args)
    new(*args).call
  end

	def initialize(upload_tei)
		@upload_tei = upload_tei
		@upload = @upload_tei.upload
		@file = File.open(open(file_url))
	end

	def call
		# TODO: gradeful error handling on:
		# missing or unavailable file, malformed pdfs
		return unless @upload.is_pdf?
		return unless @upload_tei
		return unless @file

		processFulltextDocument
		# processHeaderDocument
	end

	# private

		def processFulltextAssetDocument
			endpoint = grobid_call(:asset)
			resp = fire_away(endpoint)

			body = resp["TEI"].to_xml
			@upload_tei.update_attributes!(body: body)
		end

		def processFulltextDocument
			endpoint = grobid_call(:full)
			resp = fire_away(endpoint)

			body = resp["TEI"].to_xml
			@upload_tei.update_attributes!(body: body)
		end

		def processHeaderDocument
			endpoint = grobid_call(:header)
			resp = fire_away(endpoint)

			header = resp["TEI"]["teiHeader"].to_xml
			@upload_tei.update_attributes!(header: header)
		end

		def fire_away(endpoint)
			resp = HTTParty.post(
				endpoint, {
					body: {
						# teiCoordinates: "formula",
						# teiCoordinates: "biblStruct",
						# teiCoordinates: "ref",
						teiCoordinates: "figure",
						includeRawCitations: 1,
						input: @file
					}
				}
			)
		end

		def grobid_call(api)
			endpoint = "#{GROBID_HOST}/api/#{GROBID_ENDPOINTS[api]}"
		end

		def file_url
			url = @upload.file.url
			Rails.env.development? ? "./public" + url : url
		end

end
