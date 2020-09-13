import { StepMap } from 'prosemirror-transform'
import { keymap } from 'prosemirror-keymap'
import { undo, redo } from 'prosemirror-history'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'

class MathView {
  constructor(node, view, getPos) {
    this.node = node
    this.outerView = view
    this.getPos = getPos

    this.dom = document.createElement('prosemirror-math')
    this.innerView = null
  }
}

export default MathView
