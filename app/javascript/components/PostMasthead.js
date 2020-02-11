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
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown post-dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="dropdown07XL" data-toggle="dropdown" aria-expanded="false">
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdown07XL">
                <a className="dropdown-item" href={this.state.upload_url} target='_blank'>
                  View Original PDF
                </a>
                <a className="dropdown-item" href="#">
                  Copy Share Link
                </a>
                <a className="dropdown-item" href="#">
                  Export to Markdown
                </a>
                <a className="dropdown-item" href="#">
                  Soon! Version History
                </a>
                <a className="dropdown-item" href="#">
                  Soon! Make it Perfect ✨
                </a>
                <a className="dropdown-item" href="#">
                  🙋🏻‍♀️
                </a>
              </div>
            </li>
          </ul>

          <div className='title'>
            <h1>
              {this.state.title}
            </h1>
          </div>
          <div className='authors'>
            <h1>
              {this.state.authors}
            </h1>
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
