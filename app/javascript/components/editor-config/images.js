import schema from './schema'

// note: "pm" = ProseMirror, "store" = app-wide redux store
export const addFigure = function (pmState, pmDispatch) {
  if (!pmDispatch) return true

  window.dispatchEvent(new CustomEvent('ImageUploadRequested'))

  const handleUpload = (evt) => {
    const imageUrl = evt.details.fileUrl
    const imageType = schema.nodes.image
    pmDispatch(
      pmState.tr.replaceSelectionWith(imageType.create({ src: imageUrl }))
    )
    window.removeEventListener(handleUpload)
  }
  window.addEventListener('ImageUploadCompleted', handleUpload)

  return true
}
