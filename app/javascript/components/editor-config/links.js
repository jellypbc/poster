import ReactDOM from 'react-dom'
import React from 'react'
import PostLinkSearch from '../PostLinkSearch'

export const addPostLink = function (state, dispatch, view) {
  let sel = state.selection
  if (sel && sel.empty) return false
  if (dispatch) {
    const root =
      document.querySelector('#link-search-modal') || document.createElement('div')
    root.id = '#link-search-modal'
    document.body.appendChild(root)

    const handleClose = () => ReactDOM.unmountComponentAtNode(root)
    const handleSubmit = () => {}

    ReactDOM.render(
      <PostLinkSearch belly={handleClose} denny={handleSubmit} view={view} />,
      root
    )
  }
  return true
}
