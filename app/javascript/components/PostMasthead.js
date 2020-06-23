/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'

class PostMasthead extends React.Component {
  constructor(props) {
    super(props)

    var { post } = this.props

    this.state = {
      title: post.data.attributes.title || null,
      authors: post.data.attributes.authors || null,
      publisher: post.data.attributes.publisher || null,
      upload_url: post.data.attributes.upload_url || null,
    }
  }

  // TODO: 1. update actions links below (Copy Share Link... etc) 2. put action links into dropdown
  render() {
    return (
      <div className="header">
        <div className="header-nav">
          <div className="pdf-url">
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <a
              href={this.state.upload_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Original PDF
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default PostMasthead
