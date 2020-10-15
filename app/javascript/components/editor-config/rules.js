import {
  inputRules,
  smartQuotes,
  emDash,
  ellipsis,
} from 'prosemirror-inputrules'

import {
  inlineMathInputRule,
  blockMathInputRule,
  wrappingInputRule,
  textblockTypeInputRule,
} from './input-rules'

import { schema } from './schema'

export default inputRules({
  rules: [
    ...smartQuotes,
    ellipsis,
    emDash,

    // > blockquote
    wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),

    // 1. ordered list
    wrappingInputRule(
      /^(\d+)\.\s$/,
      schema.nodes.ordered_list,
      (match) => ({ order: +match[1] }),
      (match, node) => node.childCount + node.attrs.order === +match[1]
    ),

    // * bullet list
    wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list),

    // ``` code block
    textblockTypeInputRule(/^```$/, schema.nodes.code_block),

    // ## h2 ### h3 ### h4
    textblockTypeInputRule(
      new RegExp('^(#{2,4})\\s$'),
      schema.nodes.heading,
      (match) => ({ level: match[1].length })
    ),

    // $...$ math inline
    inlineMathInputRule(/(?:\$)([^$]+)(?:\$)$/, schema.nodes.math_inline),

    // $$ math block
    blockMathInputRule(/^\$\$$/, schema.nodes.math_block),
  ],
})
