import { history } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { columnResizing, tableEditing } from 'prosemirror-tables'
import { commentPlugin, commentUI } from './comments'
import { selectPlugin } from './select'
import { postlinkPlugin, postlinkUI } from './links'

// TODO: move directly into components
import { placeholder } from '@aeaton/prosemirror-placeholder'
import { footnotes } from '@aeaton/prosemirror-footnotes'

// import 'prosemirror-tables/style/tables.css'
import 'prosemirror-gapcursor/style/gapcursor.css'
import '@aeaton/prosemirror-footnotes/style/footnotes.css'
import '@aeaton/prosemirror-placeholder/style/placeholder.css'

import keys from './keys'
import rules from './rules'

// export a function here because some plugins need to be bound to a reference
// to a state or view object
const setupPlugins = (getView) => [
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

  // postlinkPlugin,

  commentUI((transaction) => {
    getView().dispatch(transaction)
  }),
]

export default setupPlugins

// for tables
document.execCommand('enableObjectResizing', false, false)
document.execCommand('enableInlineTableEditing', false, false)
