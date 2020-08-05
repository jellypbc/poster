class CitationsController < ApplicationController

  def add_citation
    citation = Citation.new(citation_params)

    respond_to do |format|
      if citation.save
        format.json { render json: { citation: citation.as_json } }
      else
        format.json { render json: citation.errors, status: :unprocessable_entity }
      end
    end
  end

  private

    def citation_params
      params.require(:citation).permit(
        :generated_post_id, :title, :post_id
      )
    end

end
