import { keymap } from 'prosemirror-keymap'
import { undo, redo } from 'prosemirror-history'
import { toggleMark } from 'prosemirror-commands'
import { schema } from './schema'
import { addAnnotation } from './comments'

const keys = {
  'Mod-z': undo,
  'Shift-Mod-z': redo,
  'Mod-y': redo,
  'Mod-i': toggleMark(schema.marks.em),
  'Mod-Shift-m': addAnnotation,
}

export default keymap(keys)
