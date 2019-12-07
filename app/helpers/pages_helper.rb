module PagesHelper
	require "rexml/document"

	def prettyxml(xml)
		doc = REXML::Document.new(xml)
		out = ""
		doc.write(out, 1)
		out
	end
end
