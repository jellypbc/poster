/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'

class PostMasthead extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      title: this.props.post.data.attributes.title || null,
      authors: this.props.post.data.attributes.authors || null,
      publisher: this.props.post.data.attributes.publisher || null,
      upload_url: this.props.post.data.attributes.upload_url || null,
    }
  }

  render() {
    return (
      <div className='header'>
        <div className='header-nav'>
          <div className='pdf-url'>
            <a href={this.state.upload_url} target='_blank'>
              View Original PDF
            </a>
          </div>

          <div className='title'>
            {this.state.title}
          </div>
          <div className='authors'>
            {this.state.authors}
          </div>
          <div className='publisher'>
            {this.state.publisher}
          </div>
        </div>
      </div>
    )
  }

}

export default PostMasthead
