import React from 'react'
import Modal from 'react-modal'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

function ImageModal() {
  const [isAddingImage, setIsAddingImage] = React.useState(false)
  React.useEffect(() => {
    const handleEvent = () => {
      setIsAddingImage(true)
    }
    window.addEventListener('ImageUploadRequested', handleEvent)
    return window.removeEventListener('ImageUploadRequested', handleEvent)
  })

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

  uppy.on('complete', (result) => {
    const fileUrl = result.successful[0].response.body.url

    window.dispatchEvent(
      new CustomEvent('ImageUploadCompleted', { details: { fileUrl } })
    )
  })

  return (
    <div>
      <Modal
        onRequestClose={() => {
          setIsAddingImage(false)
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

export default ImageModal
