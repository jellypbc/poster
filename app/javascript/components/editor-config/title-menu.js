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
      run: 'addAnnotation',
      // select: state => addAnnotation(state),
      content: 'Comment',
    },
  },
  marks: {
    em: {
      title: 'Toggle emphasis',
      content: 'Italics',
      active: markActive(schema.marks.em),
      run: toggleMark(schema.marks.em),
    },
    code: {
      title: 'Toggle code',
      content: '<code/>',
      active: markActive(schema.marks.code),
      run: toggleMark(schema.marks.code),
    },
    subscript: {
      title: 'Toggle subscript',
      content: 'Subscript',
      active: markActive(schema.marks.subscript),
      run: toggleMark(schema.marks.subscript),
    },
    superscript: {
      title: 'Toggle superscript',
      content: 'Superscript',
      active: markActive(schema.marks.superscript),
      run: toggleMark(schema.marks.superscript),
    },
  },
}
