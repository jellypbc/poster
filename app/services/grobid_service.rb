# class GrobidService
# params: upload_tei
# This service object handles an upload object that is a pdf

class GrobidService
	require 'open-uri'

	# In dev, make sure you have grobid running on 8070 or change this line below
	GROBID_HOST = ENV['GROBID_URL'] || "http://#{ENV['GROBID_HOST'] || "localhost"}:8070"

	# Here are some sample grobid tasks from grobid service
	GROBID_ENDPOINTS = {
		full: "processFulltextDocument",
		header: "processHeaderDocument"
	}

	def self.call(*args)
    new(*args).call
  end

	def initialize(upload_id)
		@upload = Upload.find upload_id
		@upload_tei = @upload.upload_tei
		@file = File.open(open(file_url))
	end

	def call
		# TODO: gradeful error handling on:
		# missing or unavailable file, malformed pdfs
		return unless @upload.is_pdf?
		return unless @upload_tei
		return unless @file

		processFulltextDocument
	end

	private

		def file_url
			url = @upload.file.url
			if Rails.env.development?
				"http://localhost:3000" + url
			else
				url
			end
		end

		def processFulltextDocument
			endpoint = grobid_call(:full)
			resp = fire_away(endpoint)

			body = resp["TEI"].to_xml
			@upload_tei.update!(body: body)
		end

		def processHeaderDocument
			endpoint = grobid_call(:header)
			resp = fire_away(endpoint)

			header = resp["TEI"]["teiHeader"].to_xml
			@upload_tei.update!(header: header)
		end

		def fire_away(endpoint)
			resp = HTTParty.post(
				endpoint, {
					body: {
						teiCoordinates: "ref",
						includeRawCitations: 1,
						input: @file
					}
				}
			)
		end

		def grobid_call(api)
			"#{GROBID_HOST}/api/#{GROBID_ENDPOINTS[api]}"
		end

end
