module GrobidParser
	include ActiveSupport::Concern
	require 'open-uri'


	# model.processFulltextDocument(post_id)
	def processFulltextDocument
		# get the uploads url
		url = self.file.url

		# open the url
		file = open(url)

		# grobid url
		endpoint = 'http://localhost:8070/api/processFulltextDocument'
		
		resp = HTTParty.post(
			endpoint,
			{
				body:{
					input: File.open(file),
				}
			}
		)

		# save the response on the post
		# post.save(body: JSON.parse(resp.body) )
		xml = resp["TEI"].to_xml
		post.update(body: xml)
	end

	def processTitle
		post = self.post

		# get the uploads url
		url = self.file.url

		# open the url
		file = open(url)

		# grobid url
		endpoint = 'http://localhost:8070/api/processHeaderDocument'
		
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
