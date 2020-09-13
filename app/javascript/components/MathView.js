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

  // selectNode() {
  //   this.dom.classList.add('Prosemirror-selectednode')

  //   // if this.innerView is null or false
  //   if (!this.innerView) {
  //     this.open()
  //   }
  // }

  // open() {
  //   const tooltip = this.dom.appendChild(document.createElement('div'))
  //   tooltip.className = 'footnote-tooltip'

  //   this.innerView = new EditorView(tooltip, {
  //     state: EditorState.create({
  //       doc: this.node,
  //       plugins: [
  //         keymap({
  //           'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
  //           'Mod-y': () => redo(this.outerView.state, this.outerView.dispatch),
  //         }),
  //       ],
  //     }),
  //     dispatchTransaction: this.dispatchInner.bind(this),
  //     handleDOMEvents: {
  //       mousedown: () => {
  //         if (this.outerView.hasFocus()) {
  //           this.innerView.focus()
  //         }
  //       },
  //     },
  //   })

  //   this.innerView.focus()
  // }
}

export default MathView
