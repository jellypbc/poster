# diborg's job is to transform the TEI xml received from Grobid
# require 'nokogiri'

class Diborg

	def initialize(post)
		# @doc = Nokogiri::XML(Post.last.body)
		@post = post
		return unless @post
		@doc = Nokogiri::XML(@post.body)
		@bib = @doc.css("biblStruct[@type='array']")
	end

	def run
		new_citations = []
		new_posts = []
		@bib.search('.//biblStruct').map do |bibStruct|

			citation_data = build_citation(bibStruct)
			citation = @post.citations.create(citation_data)

			post_data = build_post(bibStruct)
			post = Post.create(post_data)
			@post.citations << citation

			citation.update_attributes(generated_post_id: post.id)

			new_posts << post
			new_citations << citation
		end

		@post.update_attributes(body: build_body)

		pp "#{new_posts.count} new posts created" # debug
		pp new_citations # debug
	end

	def build_post(bibStruct)
		{
			title: find_title(bibStruct),
			authors: find_authors(bibStruct),
			publish_date: find_publish_date(bibStruct),
		}
	end

	def build_citation(bibStruct)
		{
			title: find_title(bibStruct),
			authors: find_authors(bibStruct),
			imprint_date: find_publish_date(bibStruct)
		}
	end

	def build_body
		find_abstract + find_body
	end

	private

		# returns a string
		def find_title(bibStruct)
			bibStruct.xpath('.//title')
				.xpath('.//__content__')
				.first
				.content
				.titleize
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
			# date = Time.new date
			date
		end

		def find_target(bibStruct)
			target = bibStruct.css("ptr")
		end

		def find_abstract
			@doc.css('abstract').to_xml
		end

		def find_body
			@doc.css('body').to_xml
		end

		# def find_publisher
		# end

		# def find_biblscope
		# end

		# def find_idno
		# end


end