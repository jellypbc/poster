import { history } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { commentPlugin, commentUI } from './comments'
import { selectPlugin } from './select'
import { citationPlugin, citationUI } from './citations'
import { math } from './math'
import { placeholder } from './placeholder'

import 'prosemirror-gapcursor/style/gapcursor.css'

import { bodyEditorKeys, titleEditorKeys } from './keys'
import rules from './rules'

// export a function here because some plugins need to be bound to a reference
// to a state or view object
export const bodyPlugins = (getView) => [
  rules,
  bodyEditorKeys,
  placeholder(),
  dropCursor(),
  gapCursor(),
  history(),
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
