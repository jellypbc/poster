import { InputRule } from 'prosemirror-inputrules'
import { NodeSelection } from 'prosemirror-state'

export function inlineInputRule(regexp, nodeType, getAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    const [matchedText, content] = match
    const { tr, schema } = state
    if (matchedText) {
      // Create new Math node with content. Check that it fits the schema.
      const node = nodeType.createChecked(attrs, schema.text(content))
      tr.replaceWith(start, end, node)
      const cpos = tr.doc.resolve(
        tr.selection.anchor - tr.selection.$anchor.nodeBefore.nodeSize
      )
      tr.setSelection(new NodeSelection(cpos))
      console.log('input rule creating ' + node)
    }
    return tr
  })
}
