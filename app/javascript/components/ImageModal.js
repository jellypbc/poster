import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'

import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'
import superagent from 'superagent'


function ImageModal() {
  const dispatch = useDispatch()
  const images = useSelector(state => state.images)
  const textareaRef = React.useRef()

  const handleImagesModalClose = () => {
    dispatch({type: 'closeImageModal'})
  }

  const modifierClasses = !images.isAddingImage
    ? 'j-commentForm--inactive'
    : ''

  const token = document.head
    .querySelector('[name~=csrf-token][content]')
    .content

  var uppy = Uppy({
      meta: { type: 'avatar' },
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true
    })
    .use(XHRUpload, {
      endpoint: '/images/store',
      bundle: true,
      headers: {
        csrf: token
      }
    })

  uppy.on('complete', (result) => {
    const fileUrl = result.successful[0].response.body.url
    const file_id = result.successful[0].response.body.data.id
    const mimeType = result.successful[0].response.body.data.metadata.mime_type

    console.log(result)
    console.log(file_id)

    // dispatches some action, and returns the file_id
    dispatch({type: 'addImageSuccess', payload: { file_id: file_id } })
  })

  return (
    <div>
      <Modal
        onRequestClose={() => {
          dispatch({type: 'closeImageModal'})
        }}
        className='image-modal-container'
        shouldCloseOnOverlayClick={true}
        isOpen={images.isAddingImage}
      >

        <div className='image-modal'>
          <DragDrop
            uppy={uppy}
            locale={{
              strings: {
                dropHereOr: 'Drop here or %{browse}',
                browse: 'choose a file'
              }
            }}
          />
        </div>

      </Modal>
    </div>
  )
}

export default ImageModal
