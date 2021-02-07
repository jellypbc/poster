import { store, images, waitForStore } from '../../store'
import { schema } from './schema'

// note: "pm" = ProseMirror, "store" = app-wide redux store
export const addFigure = function (pmState, pmDispatch) {
  if (!pmDispatch) return true

  store.dispatch(images.actions.addImageStart())

  waitForStore({
    selector: (storeState) => storeState.images,
    succeed: (images) => !images.isAddingImage && images.lastImage,
    fail: (images) => !images.isAddingImage && !images.lastImage,
    timeout: 1000 * 30,
  }).then((imageStoreState) => {
    const imageUrl = imageStoreState.lastImage.fileUrl
    const imageType = schema.nodes.image
    pmDispatch(
      pmState.tr.replaceSelectionWith(imageType.create({ src: imageUrl }))
    )
  })

  return true
}
