import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
// import Uploader from '../Uploader'

// export const pluginKey = new PluginKey('imageUploader')

export const addFigure = function(state, dispatch) {
  console.log('running addfigure')
  return true

  // return (

  // )
  // let sel = state.selection
  // if (sel.empty) return false
  // if (dispatch) {

  //   if (
  //     state.selection.$from.parent.inlineContent &&
  //     e.target.files.length
  //   ) {
  //     startImageUpload(view, e.target.files[0])
  //   }

  // }
  // return true
}

export const imagePlugin = new Plugin({
  state: {
    init() { return DecorationSet.empty },
    apply(tr, set) {
      console.log(">>>>>> inside imagePlugin.apply")
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      // See if the transaction adds or removes any placeholders
      let action = tr.getMeta(this)
      if (action && action.add) {
        console.log(">>>>>> action is adding")
        let widget = document.createElement('placeholder')
        let deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id,
        })
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        console.log(">>>>>> action is removing")
        set = set.remove(
          set.find(null, null, spec => spec.id == action.remove.id)
        )
      }
      return set
    },
  },
  props: {
    decorations(state) {
      return this.getState(state)
    },
  },
})

function findPlaceholder(state, id) {
  let decos = imagePlugin.getState(state)
  let found = decos.find(null, null, spec => spec.id == id)
  return found.length ? found[0].from : null
}

function startImageUpload(view, file) {
  // A fresh object to act as the ID for this upload
  let id = {}

  // Replace the selection with a placeholder
  let tr = view.state.tr
  if (!tr.selection.empty) tr.deleteSelection()
  tr.setMeta(imagePlugin, { add: { id, pos: tr.selection.from } })
  view.dispatch(tr)

  uploadFile(file).then(
    url => {
      let pos = findPlaceholder(view.state, id)
      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return
      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder
      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
          .setMeta(imagePlugin, { remove: { id } })
      )
    },
    () => {
      // On failure, just clean up the placeholder
      view.dispatch(tr.setMeta(imagePlugin, { remove: { id } }))
    }
  )
}

// This is just a dummy that loads the file and creates a data URL.
// You could swap it out with a function that does an actual upload
// and returns a regular URL for the uploaded file.
function uploadFile(file) {
  let reader = new FileReader()
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result)
    reader.onerror = () => fail(reader.error)
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 1500)
    console.log('hello')
  })
}
