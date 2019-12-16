# class DiborgService
# This is a PORO that handles the UploadTei and the Post

class DiborgService

	def self.call(*args)
    new(*args).call
  end

	def initialize(upload_tei, post)
		@upload_tei = upload_tei
		@post = post
		@doc = Nokogiri::XML(@upload_tei.body)
		@bib = @doc.css("biblStruct[@type='array']")
	end

	def call
		parse_bib_with_side_effects

		# TODO: gracefully nil these in case nothing is found
		if title = find_header_title
			@post.update_attributes!(title: title)
		end
		if body = build_body
			@post.update_attributes!(body: body)
		end
	end

	# private

		def parse_bib_with_side_effects
			@post.citations.destroy_all if @post.citations.any?

			new_citations = []
			new_posts = []
			@bib.children.css('biblStruct').map do |bibStruct|

				# build the citation
				citation_data = build_citation(bibStruct)
				citation = @post.citations.create(citation_data)

				# build the new generated post
				post_data = build_post(bibStruct)
				generated_post = Post.create!(post_data)

				# add the citation to the post
				@post.citations << citation

				# add the generated post to the citation
				citation.update_attributes(generated_post_id: generated_post.id)

				# debug
				new_posts << generated_post
				new_citations << citation
			end

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

		# finds the doc title in the teiHeader
		def find_header_title
			title = @doc.css("teiHeader")
				.css("fileDesc")
				.css("titleStmt")
				.css("title")
				.css("__content__")
				.first
				.content
				.titleize
				.truncate(120)
		end

		# returns a string
		def find_title(bibStruct)
			title = bibStruct.css('title')
				.css('__content__')
				.try(:first)
				.try(:content)
				.try(:titleize)

			title || "Title"
		end

		# returns a string, even if there is an array of authors
		def find_authors(bibStruct)
			authors = bibStruct.css("persName") unless authors.present?
			author_list = []

			authors.map do |author|
				first = author.css("forename __content__")
					.map{|a| a.content}.join(" ")
				last = author.css("surname")
					.inner_html
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