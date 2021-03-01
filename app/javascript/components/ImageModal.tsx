import React, { useCallback, useState, useMemo } from 'react'
import { addImageSuccess, closeImageModal, imagesSelector } from '../features/imagesSlice'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

export const ImageModal: React.FC = () => {
  const dispatch = useDispatch()
  const { isAddingImage } = useSelector(imagesSelector)

  const token = document.head.querySelector('[name~=csrf-token][content]')
  const handleUpload = useCallback(
    (fileUrl) => {
      dispatch(addImageSuccess({ fileUrl: fileUrl }))
    },
    [dispatch]
  )
  const uppy = useUppy(token, handleUpload)

  return (
    <div>
      <Modal
        onRequestClose={() => {
          dispatch(closeImageModal(null))
        }}
        className="image-modal-container"
        shouldCloseOnOverlayClick={true}
        isOpen={isAddingImage}
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
        csrf: token.content,
      },
    })
    _uppy.on('complete', (result: any) => {
      const fileUrl = result.successful[0].response.body.url
      onUpload(fileUrl)
      // build a new Uppy instance for the next upload
      setUploaderGeneration(uploaderGeneration + 1)
    })
    _uppy.on('error', (result: any) => {
      console.log("error!", result)
    })
    return _uppy
  }, [onUpload, token, uploaderGeneration])
}
