import { history } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { columnResizing, tableEditing } from 'prosemirror-tables'
import { commentPlugin, commentUI } from './plugin-comment'
import { imagePlugin } from './image-plugin'

// TODO: move directly into components
import { placeholder } from '@aeaton/prosemirror-placeholder'
import { footnotes } from '@aeaton/prosemirror-footnotes'

// import 'prosemirror-tables/style/tables.css'
import 'prosemirror-gapcursor/style/gapcursor.css'
import '@aeaton/prosemirror-footnotes/style/footnotes.css'
import '@aeaton/prosemirror-placeholder/style/placeholder.css'

import keys from './keys'
import rules from './rules'

export default [
	rules,
	keys,
	placeholder(),
	footnotes(),
	dropCursor(),
	gapCursor(),
	history(),
	columnResizing(),
	tableEditing(),
	commentPlugin,
	commentUI(transaction => this.dispatch({ type: 'transaction', transaction })),
  imagePlugin,
]

// for tables
document.execCommand('enableObjectResizing', false, false)
document.execCommand('enableInlineTableEditing', false, false)
