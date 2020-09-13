import { history } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { columnResizing, tableEditing } from 'prosemirror-tables'
import { commentPlugin, commentUI } from './comments'
import { selectPlugin } from './select'
import { citationPlugin, citationUI } from './citations'
import { default as footnotes } from './footnotes'
import { default as math } from './math'
import { default as placeholder } from './placeholder'

// import 'prosemirror-tables/style/tables.css'

import keys from './keys'
import rules from './rules'

// export a function here because some plugins need to be bound to a reference
// to a state or view object
const setupPlugins = (getView) => [
  rules,
  keys,
  placeholder(),
  footnotes(),
  math(),
  dropCursor(),
  gapCursor(),
  history(),
  columnResizing(),
  tableEditing(),
  selectPlugin,
  commentPlugin,
  commentUI((transaction) => {
    getView().dispatch(transaction)
  }),
  citationPlugin,
  citationUI((transaction) => {
    getView().dispatch(transaction)
  }),
]

export default setupPlugins

// for tables
document.execCommand('enableObjectResizing', false, false)
document.execCommand('enableInlineTableEditing', false, false)
