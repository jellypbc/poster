import React from 'react'

function Backlinks({ backlinks }) {
  const renderBacklink = (backlink, index) => {
    var c = backlink.attributes

    let { authors, title, publisher, imprint_date } = c

    return (
      <div key={index}>
        {c.post_id && (
          <a href={c.source_post_path}>
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

  const renderBacklinks = (backlinks) => {
    const backlinkList = backlinks.map((c, i) => renderBacklink(c, i))
    return <div>{backlinkList}</div>
  }

  let rendered
  if (backlinks.length >= 1) {
    rendered = (
      <div className="backlinks my-5">
        <h4 className="my-3">Backlinks</h4>
        {renderBacklinks(backlinks)}
      </div>
    )
  }

  return <div>{rendered}</div>
}

export default Backlinks
