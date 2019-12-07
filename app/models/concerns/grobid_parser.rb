module GrobidParser
	include ActiveSupport::Concern
	require 'open-uri'

	GROBID_HOST = ENV['GROBID_URL'] || "http://localhost:8070"

	# Here are some sample grobid tasks from grobid service

	def processFulltextDocument
		# get the uploads url
		url = self.file.url
		url = ("./public" + url) if Rails.env.development?

		# open the url
		file = open(url)

		# grobid url
		endpoint = "#{GROBID_HOST}/api/processFulltextDocument"

		resp = HTTParty.post(
			endpoint,
			{
				body:{
					input: File.open(file),
				}
			}
		)

		xml = resp["TEI"].to_xml
		post.update(body: xml)
	end

	def processHeaderDocument
		# get the uploads url
		url = self.file.url
		url = ("./public" + url) if Rails.env.development?

		# open the url
		file = open(url)

		# grobid url
		endpoint = "#{GROBID_HOST}/api/processHeaderDocument"

		resp = HTTParty.post(
			endpoint,
			{
				body:{
					input: File.open(file),
				}
			}
		)

		title = resp.dig("TEI", "teiHeader", "fileDesc", "titleStmt", "title", "__content__")
		post.update(title: title)
	end

end
