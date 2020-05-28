import { Plugin } from 'prosemirror-state'
import { history } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { columnResizing, tableEditing } from 'prosemirror-tables'
import { commentPlugin, commentUI } from './plugin-comment'
import { selectPlugin } from './select'
import { collab, sendableSteps } from 'prosemirror-collab'

// TODO: move directly into components
import { placeholder } from '@aeaton/prosemirror-placeholder'
import { footnotes } from '@aeaton/prosemirror-footnotes'

// import 'prosemirror-tables/style/tables.css'
import 'prosemirror-gapcursor/style/gapcursor.css'
import '@aeaton/prosemirror-footnotes/style/footnotes.css'
import '@aeaton/prosemirror-placeholder/style/placeholder.css'

import keys from './keys'
import rules from './rules'

function reactProps(initialProps, reactPropsKey) {
  return new Plugin({
    key: reactPropsKey,
    state: {
      init: () => initialProps,
      apply: (tr, prev, state) => {
        /* eslint-disable no-unused-expressions */
        // console.log('>>>> hello', tr.getMeta(reactPropsKey))
        // console.log('>>>> hello', reactPropsKey.getState(state))
        tr.getMeta(reactPropsKey) || prev
      },
    },
  })
}

// export a function here because some plugins need to be bound to a reference
// to a state or view object
const setupPlugins = (getView, authority, props, reactPropsKey) => {
  console.log('auth', authority)

  return [
    reactProps(props, reactPropsKey),
    collab({ version: authority.steps.length }),
    rules,
    keys,
    placeholder(),
    footnotes(),
    dropCursor(),
    gapCursor(),
    history(),
    columnResizing(),
    tableEditing(),
    selectPlugin,
    commentPlugin,
    commentUI((transaction) => {
      console.log('hello from comment ui transaction', transaction)
      console.log('state', getView().state)

      let sendable = sendableSteps(getView().state)
      console.log('sendable', sendable)
      if (sendable) {
        console.log('sendable', sendable)
        authority.receiveSteps(
          sendable.version,
          sendable.steps,
          sendable.clientID
        )
      }

      getView().dispatch(transaction)
    }),
  ]
}

export default setupPlugins

// for tables
document.execCommand('enableObjectResizing', false, false)
document.execCommand('enableInlineTableEditing', false, false)
