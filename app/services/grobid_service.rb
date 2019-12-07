# class GrobidService
# This service object handles an upload object that is a pdf

class GrobidService
	require 'open-uri'

	# In dev, make sure you have grobid running on 8070 or change this line below
	GROBID_HOST = ENV['GROBID_URL'] || "http://localhost:8070"

	# Here are some sample grobid tasks from grobid service
	GROBID_ENDPOINTS = {
		full: "processFulltextDocument",
		header: "processHeaderDocument"
	}

	def self.call(*args)
    new(*args).call
  end

	def initialize(upload_tei)
		@upload_tei = upload_tei
		@upload = @upload_tei.upload
		@file = open(file_url)
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

	private

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
			baby_yoda = File.open(@file)
			resp = HTTParty.post(
				endpoint, { body: { input: baby_yoda } }
			)
		end

		def grobid_call(api)
			endpoint = "#{GROBID_HOST}/api/#{GROBID_ENDPOINTS[api]}"
		end

		def file_url
			url = @upload.file.url
			url = ("./public" + url) if Rails.env.development?
		end

end
