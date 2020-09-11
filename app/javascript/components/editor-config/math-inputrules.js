import { InputRule } from 'prosemirror-inputrules'
import { NodeSelection } from 'prosemirror-state'

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

    return tr.setSelection(
      NodeSelection.create(tr.doc, tr.mapping.map($start.pos - 1))
    )
  })
}

// // https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/rulebuilders.js
// import {InputRule} from "./inputrules"
// import {findWrapping, canJoin} from "prosemirror-transform"

// // :: (RegExp, NodeType, ?union<Object, ([string]) → ?Object>, ?([string], Node) → bool) → InputRule
// // Build an input rule for automatically wrapping a textblock when a
// // given string is typed. The `regexp` argument is
// // directly passed through to the `InputRule` constructor. You'll
// // probably want the regexp to start with `^`, so that the pattern can
// // only occur at the start of a textblock.
// //
// // `nodeType` is the type of node to wrap in. If it needs attributes,
// // you can either pass them directly, or pass a function that will
// // compute them from the regular expression match.
// //
// // By default, if there's a node with the same type above the newly
// // wrapped node, the rule will try to [join](#transform.Transform.join) those
// // two nodes. You can pass a join predicate, which takes a regular
// // expression match and the node before the wrapped node, and can
// // return a boolean to indicate whether a join should happen.
// export function wrappingInputRule(regexp, nodeType, getAttrs, joinPredicate) {
//   return new InputRule(regexp, (state, match, start, end) => {
//     let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
//     let tr = state.tr.delete(start, end)
//     let $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && findWrapping(range, nodeType, attrs)
//     if (!wrapping) return null
//     tr.wrap(range, wrapping)
//     let before = tr.doc.resolve(start - 1).nodeBefore
//     if (before && before.type == nodeType && canJoin(tr.doc, start - 1) &&
//         (!joinPredicate || joinPredicate(match, before)))
//       tr.join(start - 1)
//     return tr
//   })
// }

// // :: (RegExp, NodeType, ?union<Object, ([string]) → ?Object>) → InputRule
// // Build an input rule that changes the type of a textblock when the
// // matched text is typed into it. You'll usually want to start your
// // regexp with `^` to that it is only matched at the start of a
// // textblock. The optional `getAttrs` parameter can be used to compute
// // the new node's attributes, and works the same as in the
// // `wrappingInputRule` function.
// export function textblockTypeInputRule(regexp, nodeType, getAttrs) {
//   return new InputRule(regexp, (state, match, start, end) => {
//     let $start = state.doc.resolve(start)
//     let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
//     if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null
//     return state.tr
//       .delete(start, end)
//       .setBlockType(start, start, nodeType, attrs)
//   })
// }

//////////

// // https://github.com/benrbray/prosemirror-math/blob/master/src/plugins/math-inputrules.ts
// import { InputRule, inputRules } from "prosemirror-inputrules";
// import { editorSchema } from "../math-schema";
// import { NodeType } from "prosemirror-model";
// import { NodeSelection } from "prosemirror-state";

// function inlineInputRule(pattern: RegExp, nodeType: NodeType, getAttrs?: (match: string[]) => any) {
// 	return new InputRule(pattern, (state, match, start, end) => {
// 		let $start = state.doc.resolve(start);
// 		let index = $start.index();
// 		let $end = state.doc.resolve(end);
// 		// get attrs
// 		let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
// 		// check if replacement valid
// 		if (!$start.parent.canReplaceWith(index, $end.index(), nodeType)) {
// 			return null;
// 		}
// 		// perform replacement
// 		return state.tr.replaceRangeWith(
// 			start, end,
// 			nodeType.create(attrs, nodeType.schema.text(match[1]))
// 		);
// 	});
// }

// function blockInputRule(pattern: RegExp, nodeType: NodeType, getAttrs?: (match: string[]) => any) {
// 	return new InputRule(pattern, (state, match, start, end) => {
// 		let $start = state.doc.resolve(start)
// 		let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
// 		if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null
// 		let tr = state.tr
// 			.delete(start, end)
// 			.setBlockType(start, start, nodeType, attrs);

// 		return tr.setSelection(NodeSelection.create(
// 			tr.doc, tr.mapping.map($start.pos - 1)
// 		));
// 	})
// }

// export const mathInputRules = inputRules({
// 	rules: [
// 		// negative lookbehind regex notation for escaped \$ delimiters
// 		// (see https://javascript.info/regexp-lookahead-lookbehind)
// 		inlineInputRule(/(?<!\\)\$(.+)(?<!\\)\$/, editorSchema.nodes.math_inline),
// 		// simpler version without the option to escape \$
// 		//inlineInputRule(/\$(.+)\$/, editorSchema.nodes.math_inline),
// 		blockInputRule(/^\$\$\s+$/, editorSchema.nodes.math_display)
// 	]
// })
