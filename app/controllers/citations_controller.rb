class CitationsController < ApplicationController
  before_action :set_citation, only: [:show, :edit, :update, :delete]

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

  def delete
    @citation.delete_now if citation_params["deleted_at"]
    respond_to do |format|
      if @citation.save
        format.html { head :ok }
        format.json { render json: { citation: @citation }, status: :ok }
      else
        format.html {head :ok }
        format.json { render json: @citation.errors, status: :unprocessable_entity }
      end
    end
  end

  private

    def set_citation
      id_or_data_key = params[:citation].present? ?
        citation_params[:data_key].to_s :
        params[:id].to_s
      
      @citation ||= begin
        Citation.find_by! data_key: id_or_data_key

      rescue ActiveRecord::RecordNotFound => e
        Citation.find id_or_data_key
      end
    end

    def citation_params
      params.require(:citation).permit(
        :generated_post_id, :title, :post_id,
        :data_to, :data_from, :data_key, :highlighted_text,
        :deleted_at,
      )
    end

end
