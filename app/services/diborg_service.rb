class DiborgService

	def self.call(*args)
    new(*args).call
  end

	def initialize(upload_tei_id, post_id)
		@upload_tei = UploadTei.find(upload_tei_id)
		@post = Post.find(post_id)
		@doc = Nokogiri::XML(@upload_tei.body)
		@bib = @doc.css("biblStruct[@type='array']")
	end

	def call
		update_post
		generate_citations

		# update_citations_and_posts
	end

	private

		def update_post
			@post.update!(body: build_body)
			@post.update!(title: parse_header_title)
			@post.update!(abstract: parse_abstract)
		end

		def generate_citations
			@post.citations.destroy_all if @post.citations.any?

			# array of citations
			# e.g. [{title: "", authors: "", imprint: ""}]
			citations = parse_citations

			citations.each do |citation|
				# generated_post = Post.create!(build_post(citation))
				generated_post = Post.create!(build_new_citation(citation))
				citation = post.create!(build_new_citation(citation))
				generated_post.citations << citation
				citation.update!(generated_post_id: generated_post.id)
			end
		end


		# ========
		# These methods massage the parsed nokogiri data into model form

		def build_new_post(citation_hash)
			{
				title: citation_hash[:title],
				authors: citation_hash[:authors],
				publish_date: citation_hash[:imprint_date]
			}
		end

		def build_new_citation(citation_hash)
			{
				title: parse_title(bibStruct),
				authors: parse_authors(bibStruct),
				imprint_date: parse_publish_date(bibStruct)
			}
		end

		# DEP
		def update_citations_and_posts
			@post.citations.destroy_all if @post.citations.any?
			@bib.children.css('biblStruxct').map do |bibStruct|
				# build and create the citation
				citation_data = build_citation(bibStruct)
				citation = @post.citations.create!(citation_data)

				# build the new generated post
				post_data = build_post(bibStruct)
				generated_post = Post.create!(post_data)

				# add the citation to the post
				@post.citations << citation

				# add the generated post to the citation
				citation.update(generated_post_id: generated_post.id)
			end
		end

		# DEP
		def build_post(bibStruct)
			{
				title: parse_title(bibStruct),
				authors: parse_authors(bibStruct),
				publish_date: parse_publish_date(bibStruct),
			}
		end

		# DEP
		def build_citation(bibStruct)
			{
				title: parse_title(bibStruct),
				authors: parse_authors(bibStruct),
				imprint_date: parse_publish_date(bibStruct)
			}
		end

		def build_body
			parse_abstract + parse_body
		end


		# ========
		# These methods return objects from the nokogiri document

		# finds the doc title in the teiHeader
		def parse_header_title
			title ||= @doc.css("teiHeader")
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
		def parse_title(bibStruct)
			title = bibStruct.css('title')
				.css('__content__')
				.try(:first)
				.try(:content)
				.try(:titleize)

			title || "Title"
		end

		# returns a string, even if there is an array of authors
		def parse_authors(bibStruct)
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

		def parse_publish_date(bibStruct)
			imprint = bibStruct.css("imprint")
			case imprint.search("type").inner_html
			when "published"
				date = imprint.css('when').inner_html
			end
			date
		end

		def parse_target(bibStruct)
			target = bibStruct.css("ptr")
		end

		def parse_abstract
			@doc.css('abstract').to_xml
		end

		def parse_header_abstract
			@doc.css('abstract').inner_text
		end

		def parse_body
			@doc.css('body').to_xml
		end

		def parse_citations
			cite_arr = []
			@doc.css("biblStruct[@type='array']")
				.children
				.css("biblStruct")
				.map { |bibStruct|
					cite_arr << build_citation(bibStruct)
				}
			cite_arr
		end


		# def parse_publisher
		# end

		# def parse_biblscope
		# end

		# def parse_idno
		# end


end
