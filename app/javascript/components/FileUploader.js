import React, { useState, useEffect, useMemo } from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

import saRequest from '../utils/saRequest'

export default function FileUploader({ url }) {
  const [fileUrl, setFileUrl] = useState('')
  const [id, setId] = useState('')
  const [error, setError] = useState(null)

  const token = document.head.querySelector('[name~=csrf-token][content]')
    .content

  const uppy = useMemo(() => {
    return new Uppy({
      meta: { type: 'upload' },
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true,
    })
      .use(XHRUpload, {
        endpoint: '/file/store',
        bundle: true,
        headers: { csrf: token },
      })
      .on('complete', (result) => {
        const id = result.successful[0].response.body.data.id
        const mimeType =
          result.successful[0].response.body.data.metadata.mime_type
        setFileUrl(result.successful[0].response.body.url)
        setId(id)

        if (mimeType === 'application/pdf') {
          fireAway(id)
        } else {
          setError('Oops, we only accept PDFs for now.')
        }
      })
  }, [fireAway, token])

  const fireAway = (id) => {
    const data = {
      file_id: id,
      upload: {},
    }
    saRequest
      .post(url)
      .send(data)
      .set('accept', 'application/json')
      .then((res) => {
        console.log(res)
        window.location = res.body.redirect_to
      })
      .catch((err) => {
        console.log(err.message)
        setError(err.message)
      })
  }

  useEffect(() => {
    return () => uppy.close()
  }, [uppy])

  return (
    <div>
      {error && <p className="error">{error}</p>}

      <DragDrop
        uppy={uppy}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the
            // system file selection dialog.
            dropHereOr: 'Drop here or %{browse}',
            // Used as the label for the link that opens the
            // system file selection dialog.
            browse: 'choose a file',
          },
        }}
      />
    </div>
  )
}
