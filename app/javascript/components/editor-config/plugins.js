import { history } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { columnResizing, tableEditing } from 'prosemirror-tables'
import { commentPlugin, commentUI } from './comments'
import { selectPlugin } from './select'
import { citationPlugin, citationUI } from './citations'
import { math } from './math'
import { placeholder } from './placeholder'

// TODO: move directly into components
import { footnotes } from '@aeaton/prosemirror-footnotes'

// import 'prosemirror-tables/style/tables.css'
import 'prosemirror-gapcursor/style/gapcursor.css'
import '@aeaton/prosemirror-footnotes/style/footnotes.css'

import { bodyEditorKeys, titleEditorKeys } from './keys'
import rules from './rules'

// export a function here because some plugins need to be bound to a reference
// to a state or view object
export const bodyPlugins = (getView) => [
  rules,
  bodyEditorKeys,
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
    getView().dispatch(transaction)
  }),
  citationPlugin,
  citationUI((transaction) => {
    getView().dispatch(transaction)
  }),
  math(),
]

export const titlePlugins = (getView) => [
  titleEditorKeys,
  placeholder(),
  history(),
  commentPlugin,
  commentUI((transaction) => {
    getView().dispatch(transaction)
  }),
]

// for tables
document.execCommand('enableObjectResizing', false, false)
document.execCommand('enableInlineTableEditing', false, false)
