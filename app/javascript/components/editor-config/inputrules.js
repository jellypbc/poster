import { InputRule } from 'prosemirror-inputrules'
import { NodeSelection } from 'prosemirror-state'
import { findWrapping, canJoin } from 'prosemirror-transform'

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

export function blockInputRule(regexp, nodeType, getAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    let $start = state.doc.resolve(start)
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    if (
      !$start
        .node(-1)
        .canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)
    )
      return null
    let tr = state.tr
      .delete(start, end)
      .setBlockType(start, start, nodeType, attrs)

    // sets selection to math node
    return tr.setSelection(
      NodeSelection.create(tr.doc, tr.mapping.map($start.pos - 1))
    )
  })
}

// from prosemirror-inputrules
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/rulebuilders.js
export function textblockTypeInputRule(regexp, nodeType, getAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    let $start = state.doc.resolve(start)
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    if (
      !$start
        .node(-1)
        .canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)
    )
      return null
    return state.tr
      .delete(start, end)
      .setBlockType(start, start, nodeType, attrs)
  })
}

// from prosemirror-inputrules
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/rulebuilders.js
export function wrappingInputRule(regexp, nodeType, getAttrs, joinPredicate) {
  return new InputRule(regexp, (state, match, start, end) => {
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    let tr = state.tr.delete(start, end)
    let $start = tr.doc.resolve(start),
      range = $start.blockRange(),
      wrapping = range && findWrapping(range, nodeType, attrs)
    if (!wrapping) return null
    tr.wrap(range, wrapping)
    let before = tr.doc.resolve(start - 1).nodeBefore
    if (
      before &&
      before.type == nodeType &&
      canJoin(tr.doc, start - 1) &&
      (!joinPredicate || joinPredicate(match, before))
    )
      tr.join(start - 1)
    return tr
  })
}
