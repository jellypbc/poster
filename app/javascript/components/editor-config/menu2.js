import {
  joinUp,
  lift,
  setBlockType,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { wrapInList } from './schema-list'
// import { addColumnAfter, addColumnBefore } from 'prosemirror-tables'
import { addAnnotation } from './plugin-comment'
import { addFigure } from './images'
import { schema } from './schema'
import icons from './icons'

const markActive = (type) => (state) => {
  const { from, $from, to, empty } = state.selection

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type)
}

const blockActive = (type, attrs = {}) => (state) => {
  const { $from, to, node } = state.selection

  if (node) {
    return node.hasMarkup(type, attrs)
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs)
}

const canInsert = (type) => (state) => {
  const { $from } = state.selection

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d)

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true
    }
  }

  return false
}

const promptForURL = () => {
  let url = window && window.prompt('Enter the URL', 'https://')

  if (url && !/^https?:\/\//i.test(url)) {
    url = 'http://' + url
  }

  return url
}

export default {
  // figures: {
  //   addFigure: {
  //     title: 'Add Image',
  //     id: 'image-button',
  //     run: addFigure,
  //     // select: state => addFigure(state),
  //     content: icons.image,
  //   },
  // },
  // comments: {
  //   addComment: {
  //     title: 'Add Comment',
  //     run: addAnnotation,
  //     // select: state => addAnnotation(state),
  //     content: icons.comment,
  //   },
  // },
  // marks: {
  //   em: {
  //     title: 'Toggle emphasis',
  //     content: 'Italic',
  //     active: markActive(schema.marks.em),
  //     run: toggleMark(schema.marks.em),
  //   },
  //   strong: {
  //     title: 'Toggle strong',
  //     content: 'Bold',
  //     active: markActive(schema.marks.strong),
  //     run: toggleMark(schema.marks.strong),
  //   },
  //   code: {
  //     title: 'Toggle code',
  //     content: '<code/>',
  //     active: markActive(schema.marks.code),
  //     run: toggleMark(schema.marks.code),
  //   },
  //   subscript: {
  //     title: 'Toggle subscript',
  //     content: icons.subscript,
  //     active: markActive(schema.marks.subscript),
  //     run: toggleMark(schema.marks.subscript),
  //   },
  //   superscript: {
  //     title: 'Toggle superscript',
  //     content: icons.superscript,
  //     active: markActive(schema.marks.superscript),
  //     run: toggleMark(schema.marks.superscript),
  //   },
  //   underline: {
  //     title: 'Toggle underline',
  //     content: icons.underline,
  //     active: markActive(schema.marks.underline),
  //     run: toggleMark(schema.marks.underline),
  //   },
  //   strikethrough: {
  //     title: 'Toggle strikethrough',
  //     content: icons.strikethrough,
  //     active: markActive(schema.marks.strikethrough),
  //     run: toggleMark(schema.marks.strikethrough),
  //   },
  //   link: {
  //     title: 'Add or remove link',
  //     content: icons.link,
  //     active: markActive(schema.marks.link),
  //     enable: (state) => !state.selection.empty,
  //     run(state, dispatch) {
  //       if (markActive(schema.marks.link)(state)) {
  //         toggleMark(schema.marks.link)(state, dispatch)
  //         return true
  //       }

  //       const href = promptForURL()
  //       if (!href) return false

  //       toggleMark(schema.marks.link, { href })(state, dispatch)
  //       // view.focus()
  //     },
  //   },
  // },
  blocks: {
    h2: {
      title: 'Change to heading level 2',
      content: 'Heading 2',
      active: blockActive(schema.nodes.heading, { level: 2 }),
      enable: setBlockType(schema.nodes.heading, { level: 2 }),
      run: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    h3: {
      title: 'Change to heading level 3',
      content: 'Heading 3',
      active: blockActive(schema.nodes.heading, { level: 2 }),
      enable: setBlockType(schema.nodes.heading, { level: 2 }),
      run: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    h4: {
      title: 'Change to heading level 2',
      content: 'Heading 4',
      active: blockActive(schema.nodes.heading, { level: 2 }),
      enable: setBlockType(schema.nodes.heading, { level: 2 }),
      run: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    ordered_list: {
      title: 'Wrap in ordered list',
      content: 'Numbered List',
      active: blockActive(schema.nodes.ordered_list),
      enable: wrapInList(schema.nodes.ordered_list),
      run: wrapInList(schema.nodes.ordered_list),
    },
    bullet_list: {
      title: 'Wrap in bullet list',
      content: 'Bulleted List',
      active: blockActive(schema.nodes.bullet_list),
      enable: wrapInList(schema.nodes.bullet_list),
      run: wrapInList(schema.nodes.bullet_list),
    },
    blockquote: {
      title: 'Wrap in block quote',
      content: 'Blockquote',
      active: blockActive(schema.nodes.blockquote),
      enable: wrapIn(schema.nodes.blockquote),
      run: wrapIn(schema.nodes.blockquote),
    },
    code_block: {
      title: 'Change to code block',
      content: 'Codeblock',
      active: blockActive(schema.nodes.code_block),
      enable: setBlockType(schema.nodes.code_block),
      run: setBlockType(schema.nodes.code_block),
    },
    strong: {
      title: 'Toggle strong',
      content: 'Bold',
    },
    em: {
      title: 'Toggle strong',
      content: 'Italic',
    },
    code: {
      title: 'Toggle code',
      content: '<code/>',
    },
    figure: {
      title: 'Upload figure',
      content: 'Figure',
    },
    upload_pdf: {
      title: 'Upload a PDF',
      content: 'Upload a PDF',
    },
    bidirectional_link: {
      title: 'Link to post',
      content: 'Link to post',
    },
    equation: {
      title: 'Change to equation block',
      content: 'LaTeX',
    },
  },

  // blocks: {
  //   plain: {
  //     title: 'Change to paragraph',
  //     content: icons.paragraph,
  //     active: blockActive(schema.nodes.paragraph),
  //     enable: setBlockType(schema.nodes.paragraph),
  //     run: setBlockType(schema.nodes.paragraph),
  //   },

  //   lift: {
  //     title: 'Lift out of enclosing block',
  //     content: icons.lift,
  //     enable: lift,
  //     run: lift,
  //   },
  //   join_up: {
  //     title: 'Join with above block',
  //     content: icons.join_up,
  //     enable: joinUp,
  //     run: joinUp,
  //   },
  // },
  // insert: {
  //   // image: {
  //   //   title: 'Insert image',
  //   //   content: icons.image,
  //   //   enable: canInsert(schema.nodes.image),
  //   //   run: (state, dispatch) => {
  //   //     const src = promptForURL()
  //   //     if (!src) return false

  //   //     const img = schema.nodes.image.createAndFill({ src })
  //   //     dispatch(state.tr.replaceSelectionWith(img))
  //   //   },
  //   // },
  //   footnote: {
  //     title: 'Insert footnote',
  //     content: icons.footnote,
  //     enable: canInsert(schema.nodes.footnote),
  //     run: (state, dispatch) => {
  //       const footnote = schema.nodes.footnote.create()
  //       dispatch(state.tr.replaceSelectionWith(footnote))
  //     },
  //   },
  //   // hr: {
  //   //   title: 'Insert horizontal rule',
  //   //   content: 'HR',
  //   //   enable: canInsert(schema.nodes.horizontal_rule),
  //   //   run: (state, dispatch) => {
  //   //     const hr = schema.nodes.horizontal_rule.create()
  //   //     dispatch(state.tr.replaceSelectionWith(hr))
  //   //   }
  //   // },
  //   table: {
  //     title: 'Insert table',
  //     content: icons.table,
  //     enable: canInsert(schema.nodes.table),
  //     run: (state, dispatch) => {
  //       // const { from } = state.selection
  //       let rowCount = window && window.prompt('How many rows?', 2)
  //       let colCount = window && window.prompt('How many columns?', 2)

  //       const cells = []
  //       while (colCount--) {
  //         cells.push(schema.nodes.table_cell.createAndFill())
  //       }

  //       const rows = []
  //       while (rowCount--) {
  //         rows.push(schema.nodes.table_row.createAndFill(null, cells))
  //       }

  //       const table = schema.nodes.table.createAndFill(null, rows)
  //       dispatch(state.tr.replaceSelectionWith(table))

  //       // const tr = state.tr.replaceSelectionWith(table)
  //       // tr.setSelection(Selection.near(tr.doc.resolve(from)))
  //       // dispatch(tr.scrollIntoView())
  //       // view.focus()
  //     },
  //   },
  // },
  // history: {
  //   undo: {
  //     title: 'Undo last change',
  //     content: icons.undo,
  //     enable: undo,
  //     run: undo,
  //   },
  //   redo: {
  //     title: 'Redo last undone change',
  //     content: icons.redo,
  //     enable: redo,
  //     run: redo,
  //   },
  // },
  // // table: {
  // // addColumnBefore: {
  // //   title: 'Insert column before',
  // //   content: icons.after,
  // //   active: addColumnBefore, // TOOD: active -> select
  // //   run: addColumnBefore
  // // },
  // // addColumnAfter: {
  // //   title: 'Insert column before',
  // //   content: icons.before,
  // //   active: addColumnAfter, // TOOD: active -> select
  // //   run: addColumnAfter
  // // }
  // // }
}
