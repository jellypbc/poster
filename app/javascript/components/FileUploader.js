import React, { useState, useEffect, useMemo } from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { DragDrop } from '@uppy/react'

import saRequest from '../utils/saRequest'

// export default function FileUploader({ url }) {
//   const [fileUrl, setFileUrl] = useState('')
//   const [id, setId] = useState('')
//   const [error, setError] = useState(null)
//   const token = document.head.querySelector('[name~=csrf-token][content]').content

//   const uppy = useMemo(() => {
//     return new Uppy({
//       meta: { type: 'upload' },
//       restrictions: { maxNumberOfFiles: 1 },
//       autoProceed: true,
//     })
//       .use(XHRUpload, {
//         endpoint: '/file/store',
//         bundle: true,
//         headers: { csrf: token },
//       })
//       .on('complete', (result) => {
//         const fileUrl = result.successful[0].response.body.url
//         const id = result.successful[0].response.body.data.id
//         const mimeType =
//           result.successful[0].response.body.data.metadata.mime_type
//         setFileUrl(fileUrl)
//         setId(id)

//         if (mimeType === 'application/pdf') {
//           fireAway(id)
//         } else {
//           setError('Oops, we only accept PDFs for now.')
//         }
//       })
//   })

//   const fireAway = () => {
//     const data = {
//       file_id: id,
//       upload: {},
//     }
//     saRequest
//       .post(url)
//       .send(data)
//       .set('accept', 'application/json')
//       .then((res) => {
//         console.log(res)
//         window.location = res.body.redirect_to
//       })
//       .catch((err) => {
//         console.log(err.message)
//         setError(err.message)
//       })
//   }

//   useEffect(() => {
//     return () => uppy.close()
//   })

//   return (
//     <div>
//       {error && <p className="error">{error}</p>}

//       <DragDrop
//         uppy={uppy}
//         locale={{
//           strings: {
//             // Text to show on the droppable area.
//             // `%{browse}` is replaced with a link that opens the
//             // system file selection dialog.
//             dropHereOr: 'Drop here or %{browse}',
//             // Used as the label for the link that opens the
//             // system file selection dialog.
//             browse: 'choose a file',
//           },
//         }}
//       />
//     </div>
//   )
// }

class FileUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileUrl: '',
      id: '',
    }

    const token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    this.uppy = Uppy({
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
        this.setState({
          fileUrl: result.successful[0].response.body.url,
          id: id,
        })

        if (mimeType === 'application/pdf') {
          this.fireAway(id)
        } else {
          this.setState({ error: 'Oops, we only accept PDFs for now.' })
        }
      })
  }

  fireAway(id) {
    const url = this.props.url
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
        this.setState({ error: err.message })
      })
  }

  componentWillUnmount() {
    this.uppy.close()
  }

  render() {
    return (
      <div>
        {this.state.error && <p className="error">{this.state.error}</p>}

        <DragDrop
          uppy={this.uppy}
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
}

export default FileUploader
