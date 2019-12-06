# diborg's job is to transform the TEI xml received from Grobid
# require 'nokogiri'

class Diborg

	def initialize(post)
		# @doc = Nokogiri::XML(Post.last.body)
		@doc = Nokogiri::XML(post.body)
		@bib = @doc.css("biblStruct[@type='array']")
	end

	def run
		posts = []
		@bib.search('.//biblStruct').map do |bibStruct|
			posts << Post.new(build_post(bibStruct))
		end
		pp posts # debug
	end

	def build_post(bibStruct)
		post = {
			title: find_title(bibStruct),
			authors: find_authors(bibStruct),
			date: find_publish_date(bibStruct),
		}
	end

	private

		# returns a string
		def find_title(bibStruct)
			bibStruct.xpath('.//title')
				.xpath('.//__content__')
				.first
				.content
		end

		# returns a string, even if there is an array
		def find_authors(bibStruct)
			authors = bibStruct.css("persName") unless authors.present?
			author_list = []

			authors.map do |author|
				first = author.css("forename __content__").map{|a| a.content}.join(" ")
				last = author.css("surname").inner_html
				full = []
				full << first if first.present?
				full << last if last.present?
				full = full.join(" ")
				author_list << full
			end

	  	author_list.join(", ")
		end

		def find_publish_date(bibStruct)
			imprint = bibStruct.css("imprint")
			case imprint.search("type").inner_html
			when "published"
				date = imprint.css('when').inner_html
			end

			date = Time.new date
		end

		def find_target(bibStruct)
			target = bibStruct.css("ptr")
		end

		# def find_publisher
		# end

		# def find_biblscope
		# end

		# def find_idno
		# end


end