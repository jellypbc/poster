import { store, waitForStore, TIMEOUT_ERROR } from '../store'
import schema from './schema'

// note: "pm" = ProseMirror, "store" = app-wide redux store
export const addFigure = function (pmState, pmDispatch) {
  if (!pmDispatch) return true

  store.dispatch({
    type: 'addImageStart',
  })

  waitForStore({
    selector: (storeState) => storeState.images,
    succeed: (images) => !images.isAddingImage && images.lastImage,
    fail: (images) => !images.isAddingImage && !images.lastImage,
    timeout: 1000 * 30,
  })
    .then((imageStoreState) => {
      const imageUrl = imageStoreState.lastImage.fileUrl
      const imageType = schema.nodes.image
      pmDispatch(
        pmState.tr.replaceSelectionWith(imageType.create({ src: imageUrl }))
      )
    })
    .catch((err) => {
      if (err.message === TIMEOUT_ERROR) {
        store.dispatch({
          type: 'closeImageModal',
        })
      }
      // else, they closed the modal manually (or got an unrecoverable error)
    })

  return true
}
