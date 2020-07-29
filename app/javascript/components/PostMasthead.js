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
      <div>
        <p className="authors">{this.state.authors}</p>
      </div>
    )
  }
}

export default PostMasthead
