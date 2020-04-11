import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

function ImageModal() {
  const dispatch = useDispatch()
  const imagesState = useSelector(state => state.images)

  const token = document.head.querySelector('[name~=csrf-token][content]')
    .content

  var uppy = Uppy({
    meta: { type: 'figure' },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
  }).use(XHRUpload, {
    endpoint: '/images/store',
    bundle: true,
    headers: {
      csrf: token,
    },
  })

  uppy.on('complete', result => {
    const fileUrl = result.successful[0].response.body.url
    dispatch({
      type: 'addImageSuccess',
      payload: { fileUrl: fileUrl },
    })
  })

  return (
    <div>
      <Modal
        onRequestClose={() => {
          dispatch({ type: 'closeImageModal' })
        }}
        className="image-modal-container"
        shouldCloseOnOverlayClick={true}
        isOpen={imagesState.isAddingImage}
      >
        <div className="image-modal">
          <DragDrop
            uppy={uppy}
            locale={{
              strings: {
                dropHereOr: 'Drop here or %{browse}',
                browse: 'choose a file',
              },
            }}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ImageModal
