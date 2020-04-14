import schema from './schema'

export const addFigure = function (state, dispatch) {
  if (!dispatch) return true

  window.dispatchEvent(new CustomEvent('ImageUploadRequested'))

  const handleUpload = (evt) => {
    const imageUrl = evt.detail.fileUrl
    const imageType = schema.nodes.image
    dispatch(state.tr.replaceSelectionWith(imageType.create({ src: imageUrl })))
  }
  window.addEventListener('ImageUploadCompleted', handleUpload, { once: true })

  return true
}
