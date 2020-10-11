import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'

import PostEditor from './PostEditor'
import ImageModal from './ImageModal'

import Modal from 'react-modal'

Modal.setAppElement('#root')

// This is where Redux is set up, it has to be a parent component for anything that wants to
// reference the reducer state in the editor.
// Anything can dispatch to the reducer by importing `dispatch` from react-redux
// and the component will rerender any subscribers on change.
export default function PostPage(props) {
  // props = post, currentUser, isProcessing, editable
  return (
    <Provider store={store}>
      <PostEditor {...props} />
      <ImageModal />
    </Provider>
  )
}
