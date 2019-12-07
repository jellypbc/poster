module GrobidParser
	include ActiveSupport::Concern
	require 'open-uri'

	# In dev, make sure you have grobid running on 8070 or change this line below
	GROBID_HOST = ENV['GROBID_URL'] || "http://localhost:8070"

	# Here are some sample grobid tasks from grobid service
	GROBID_ENDPOINTS = {
		full: "processFulltextDocument",
		header: "processHeaderDocument"
	}

	def processFulltextDocument
		file = open(url)

		resp = fire_away

		body = resp["TEI"].to_xml
		post.update(body: body)
	end

	def processHeaderDocument
		file = open(url)

		resp = fire_away

		title = resp.dig("TEI", "teiHeader", "fileDesc", "titleStmt", "title", "__content__")
		post.update(title: title)
	end


	private
		def fire_away
			resp = HTTParty.post(
				endpoint, { body: { input: File.open(file) } }
			)
			resp
		end

		def grobid_call(api)
			endpoint = "#{GROBID_HOST}/api/#{GROBID_ENDPOINTS[api]}"
		end

		def url
			url = self.file.url
			url = ("./public" + url) if Rails.env.development?
		end

end
