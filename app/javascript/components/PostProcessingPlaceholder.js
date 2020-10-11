import React from 'react'

export default function PostProcessingPlaceholder() {
  return (
    <div className="post-placeholder animated fadeIn">
      <div className="post-placeholder-message">
        <img alt="loading-gif" src="https://i.imgur.com/NFShbm3.gif" />
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
