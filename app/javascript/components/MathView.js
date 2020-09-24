import { StepMap } from 'prosemirror-transform'
import { keymap } from 'prosemirror-keymap'
import { undo, redo } from 'prosemirror-history'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'

import katex from 'katex'

class MathView {
  constructor(node, view, getPos, block) {
    this.node = node
    this.outerView = view
    this.getPos = getPos
    this.block = block

    let temp = document.createElement('div')

    if (this.block) {
      temp.innerHTML = `
      <div class="math-block" contentEditable="false">
        <div class="katex-render" ref="render">
        </div>
        <div class="katex-editor" ref="editor">
        </div>
      </div>`
    } else {
      temp.innerHTML = `
      <div class="math" contentEditable="false">
        <div class="katex-render" ref="render">
        </div>
        <div class="katex-editor" ref="editor">
        </div>
      </div>`
    }

    this.dom = temp.firstElementChild
    this.innerView = null
    this.open()
    this.close()
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode')

    if (!this.innerView) {
      this.open()
    }
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode')

    if (this.innerView) {
      this.close()
    }
  }

  open() {
    const tooltip = this.dom.querySelector('.katex-editor')

    this.innerView = new EditorView(tooltip, {
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
            'Mod-y': () => redo(this.outerView.state, this.outerView.dispatch),
          }),
        ],
      }),
      dispatchTransaction: this.dispatchInner.bind(this),
      handleDOMEvents: {
        mousedown: () => {
          if (this.outerView.hasFocus()) {
            this.innerView.focus()
          }
        },
      },
      // editable: function (state) {
      //   console.log('rprops', this)
      //   return false
      // }.bind(this),
    })

    var editor = this.innerView
    var dom = this.dom

    this.dom
      .querySelector('.katex-editor')
      .addEventListener('input', function (event) {
        let value = editor.dom.textContent
        katex.render(value, dom.querySelector('.katex-render'), {
          throwOnError: false,
          displayMod: false,
        })
      })
    this.innerView.focus()
    let value = editor.dom.textContent
    katex.render(value, dom.querySelector('.katex-render'), {
      throwOnError: false,
      displayMode: false,
    })
  }

  close() {
    this.innerView.destroy()
    this.innerView = null
  }

  dispatchInner(tr) {
    console.log('dispatch inner', JSON.stringify(tr.steps))
    const { state, transactions } = this.innerView.state.applyTransaction(tr)

    this.innerView.updateState(state)

    if (!tr.getMeta('fromOutside')) {
      let outerTr = this.outerView.state.tr,
        offsetMap = StepMap.offset(this.getPos() + 1)
      for (let i = 0; i < transactions.length; i++) {
        let steps = transactions[i].steps
        for (let j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap))
      }
      if (outerTr.docChanged) this.outerView.dispatch(outerTr)
    }
  }

  update(node) {
    console.log('update node to ', node)
    if (!node.sameMarkup(this.node)) {
      return false
    }

    this.node = node

    if (this.innerView) {
      const state = this.innerView.state
      const start = node.content.findDiffStart(state.doc.content)

      if (start != null) {
        let { a: endA, b: endB } = node.content.findDiffEnd(state.doc.content)

        const overlap = start - Math.min(endA, endB)

        if (overlap > 0) {
          endA += overlap
          endB += overlap
        }

        this.innerView.dispatch(
          state.tr
            .replace(start, endB, node.slice(start, endA))
            .setMeta('fromOutside', true)
        )
      }
    }

    return true
  }

  destroy() {
    if (this.innerView) {
      this.close()
    }
  }

  stopEvent(event) {
    return this.innerView && this.innerView.dom.contains(event.target)
  }

  ignoreMutation() {
    return true
  }
}

export default MathView
