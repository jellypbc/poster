import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'

export const selectPlugin = new Plugin({
  state: {
    init(config, instance) {
      return { deco: DecorationSet.empty }
    },
    apply(transaction, state, prevEditorState, editorState) {
      const sel = transaction.curSelection
      if (sel) {
        const decos = [
          Decoration.inline(
            sel.$from.pos,
            sel.$to.pos,
            { class: 'selection-marker' },
            { inclusiveLeft: true, inclusiveRight: true }
          ),
        ]
        const deco = DecorationSet.create(editorState.doc, decos)
        return { deco }
      }

      return state
    },
  },
  props: {
    decorations(state) {
      if (state && this.getState(state)) {
        return this.getState(state).deco
      }
      return null
    },
  },
})

// export default selectPlugin;
