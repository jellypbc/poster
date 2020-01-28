/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'

class PostProcessingPlaceholder extends React.Component {

  render() {
    return (
      <div className='post-placeholder animated fadeIn'>
        <div className='post-placeholder-message'>
          <img alt='loading-gif' src='https://i.imgur.com/NFShbm3.gif' />
          <div className="box">
            <h3>Doing our magic dance.</h3>
            <p>
              <i className="fa fa-spin fa-cog mr-1" />
              Please wait while we process your upload.
            </p>
          </div>
        </div>
      <div className="title-shape"></div>
      <div className="body-shape"></div>
      </div>
    )
  }

}

export default PostProcessingPlaceholder
