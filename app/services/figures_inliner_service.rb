# class FiguresInlineService
# FiguresInlinerService.call(post_id)
# Inlines upload_images into the post body, or appends them to the end.
# TODO: develop strategy for replacing target based on caption text, labels, or etc

class FiguresInlinerService

  def self.call(*args)
    new(*args).call
  end

  def initialize(post_id)
		@post = Post.find(post_id)

		# @upload_tei = UploadTei.find(upload_tei_id)
		# @doc = Nokogiri::XML(@upload_tei.body)
  end

	def call
		unfound = []
		@post.figures.each do |figure|
			img = "<img src='#{figure.image.url}'/>"
			caption = "<p>#{figure.caption}</p>"
			figure_html = "#{img} #{caption}"


			target = case figure.figure_type
			when "Figure"
				"#fig_#{figure.name}"
			when "Table"
				"#tab_#{figure.name}"
			end


			if @post.body.include?(target)
				puts ">>>> replacing #{target} with #{img}"
				new_body = @post.body.gsub(target, figure_html)
				@post.update!(body: new_body)
			else
				unfound << figure_html
			end
		end

		if unfound.any?
			new_body = @post.body + "<h3>Figures</h3>" + unfound.join("<br/>")
			@post.update!(body: new_body)
		end
	end

  private

end
