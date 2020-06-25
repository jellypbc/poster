import { toggleMark } from 'prosemirror-commands'
import { addAnnotation } from './plugin-comment'
import { schema } from './schema'
import icons from './icons'

const markActive = (type) => (state) => {
  const { from, $from, to, empty } = state.selection

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type)
}

export default {
  comments: {
    addComment: {
      title: 'Add Comment',
      run: addAnnotation,
      // select: state => addAnnotation(state),
      content: icons.comment,
    },
  },
  marks: {
    em: {
      title: 'Toggle emphasis',
      content: icons.em,
      active: markActive(schema.marks.em),
      run: toggleMark(schema.marks.em),
    },
    code: {
      title: 'Toggle code',
      content: icons.code,
      active: markActive(schema.marks.code),
      run: toggleMark(schema.marks.code),
    },
    subscript: {
      title: 'Toggle subscript',
      content: icons.subscript,
      active: markActive(schema.marks.subscript),
      run: toggleMark(schema.marks.subscript),
    },
    superscript: {
      title: 'Toggle superscript',
      content: icons.superscript,
      active: markActive(schema.marks.superscript),
      run: toggleMark(schema.marks.superscript),
    },
  },
}
