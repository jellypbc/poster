import React from 'react'

function Citations(props) {
  const renderCitation = (citation, index) => {
    var c = citation.attributes

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
                  {c.authors}.&nbsp;
                  {c.title}.&nbsp;
                  {c.publisher},&nbsp;
                  {c.imprint_date}.
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

  const citations = props.post.included.filter((c) => c.type === 'citation')

  return (
    <div className="citations my-5">
      <h4 className="my-3">References</h4>
      {renderCitations(citations)}
    </div>
  )
}

export default Citations
