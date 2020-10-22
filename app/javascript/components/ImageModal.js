import React, { useCallback, useState, useMemo } from 'react'
import { images } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

export function ImageModal() {
  const dispatch = useDispatch()
  const imagesState = useSelector((state) => state.images)

  const token = document.head.querySelector('[name~=csrf-token][content]')
    .content
  const handleUpload = useCallback(
    (fileUrl) => {
      dispatch(images.actions.addImageSuccess({ fileUrl: fileUrl }))
    },
    [dispatch]
  )
  const uppy = useUppy(token, handleUpload)

  return (
    <div>
      <Modal
        onRequestClose={() => {
          dispatch(images.actions.closeImageModal())
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

// React Hook that manages Uppy instances for uploading
function useUppy(token, onUpload) {
  const [uploaderGeneration, setUploaderGeneration] = useState(0)
  return useMemo(() => {
    const _uppy = Uppy({
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
    _uppy.on('complete', (result) => {
      const fileUrl = result.successful[0].response.body.url
      onUpload(fileUrl)
      // build a new Uppy instance for the next upload
      setUploaderGeneration(uploaderGeneration + 1)
    })
    return _uppy
  }, [onUpload, token, uploaderGeneration])
}
