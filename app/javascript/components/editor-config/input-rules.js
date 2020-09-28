import { InputRule } from 'prosemirror-inputrules'
// import { NodeSelection } from 'prosemirror-state'
import { findWrapping, canJoin } from 'prosemirror-transform'

export function textblockTypeInputRule(rule, nodeType, getAttrs) {
  return new InputRule(rule, (state, match, start, end) => {
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

export function wrappingInputRule(rule, nodeType, getAttrs, joinPredicate) {
  return new InputRule(rule, (state, match, start, end) => {
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
