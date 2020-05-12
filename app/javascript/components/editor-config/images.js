import { store } from '../store'
import { schema } from './schema'

export const addFigure = function (state, dispatch) {
  console.log(state)
  if (dispatch) {
    // we're now in redux land, and no longer in PM land
    store.dispatch({
      type: 'addImageStart',
      payload: {
        onImageAddSuccess: (action) => {
          var imageUrl = action.payload.fileUrl
          var imageType = schema.nodes.image
          let tr = state.tr
          dispatch(tr.replaceSelectionWith(imageType.create({ src: imageUrl })))
          return true
        },
      },
    })
  }
  return true
}
