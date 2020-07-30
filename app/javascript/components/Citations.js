import React from 'react'

function Citations(props) {
  const renderCitation = (citation, index) => {
    var c = citation.attributes

    let { authors, title, publisher, imprint_date } = c

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
                  {title && <span>{title}.&nbsp;</span>}
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

  const citations = props.included.filter((c) => c.type === 'citation')

  let rendered
  if (citations.length >= 1) {
    rendered = (
      <div className="citations my-5">
        <h4 className="my-3">References</h4>
        {renderCitations(citations)}
      </div>
    )
  }

  return <div>{rendered}</div>
}

export default Citations
