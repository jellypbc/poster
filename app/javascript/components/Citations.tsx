import React from 'react'
import type { ICitation } from './types'


interface Props {
  citations: Array<ICitation>
}

export const Citations: React.FC<Props> = ({ citations }) => {
  const renderCitation = (citation, index) => {
    const c = citation.attributes

    const { authors, title, publisher, imprint_date } = c

    return (
      <div key={index}>
        {c.generated_post_id && (
          <a href={c.generated_post_path}>
            <div className="reference">
              <div className="list-index">
                <p>{index + 1}.</p>
              </div>

              <div className="citation-info">
                <p>
                  {authors && <span>{authors}.&nbsp;</span>}
                  {title ? (
                    <span>{title}.&nbsp;</span>
                  ) : (
                    <span>
                      <em>[ Untitled ].</em>
                    </span>
                  )}
                  {publisher && <span>{publisher},&nbsp;</span>}
                  {imprint_date && <span>{imprint_date}.</span>}
                </p>
              </div>
            </div>
          </a>
        )}
      </div>
    )
  }

  const renderCitations = (citations) => {
    const citationList = citations.map((c, i) => renderCitation(c, i))
    return <div>{citationList}</div>
  }

  let rendered
  if (citations.length >= 1) {
    rendered = (
      <div className="citations my-5">
        <h4 className="my-3">References</h4>
        <hr />
        {renderCitations(citations)}
      </div>
    )
  }

  return <div>{rendered}</div>
}