import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'

import { PostEditor } from './PostEditor'
import { ImageModal } from './ImageModal'

import Modal from 'react-modal'
import type { 
  IPost, 
  ICurrentUser, 
  IBacklink, 
  ICitation
} from './types'

Modal.setAppElement('#root')

// This is where Redux is set up, it has to be a parent component for anything that wants to
// reference the reducer state in the editor.
// Anything can dispatch to the reducer by importing `dispatch` from react-redux
// and the component will rerender any subscribers on change.

interface Props {
  post: IPost
  currentUser: ICurrentUser
  editable: boolean
  isProcessing: boolean
  backlinks: Array<IBacklink>
  citations: Array<ICitation>
}

export const PostPage: React.FC<Props> = (props) => {
  return (
    <Provider store={store}>
      <PostEditor {...props} />
      <ImageModal />
    </Provider>
  )
}
