import { orderedList, bulletList, listItem } from './schema-list'

const pDOM = ['p', 0],
  blockquoteDOM = ['blockquote', 0],
  hrDOM = ['hr'],
  preDOM = ['pre', ['code', 0]],
  brDOM = ['br']

const defaultNodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: 'block+',
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM
    },
  },

  // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM
    },
  },

  // :: NodeSpec A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM
    },
  },

  // :: NodeSpec A heading textblock, with a `level` attribute that
  // should hold the number 2 to 4. Parsed and serialized as `<h2>` to
  // `<h4>` elements.
  heading: {
    attrs: { level: { default: 2 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
    ],
    toDOM(node) {
      return ['h' + node.attrs.level, 0]
    },
  },

  // :: NodeSpec A code listing. Disallows marks or non-text inline
  // nodes by default. Represented as a `<pre>` element with a
  // `<code>` element inside of it.
  code_block: {
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM
    },
  },

  // :: NodeSpec The text node.
  text: {
    group: 'inline',
  },

  // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
  // `alt`, and `href` attributes. The latter two default to the empty
  // string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(dom) {
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
          }
        },
      },
    ],
    toDOM(node) {
      const { src, alt, title } = node.attrs
      return ['img', { src, alt, title }]
    },
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM
    },
  },

  // :: NodeSpec An inline math element.
  math_inline: {
    group: 'inline',
    content: 'text*',
    inline: true,
    draggable: true,
    atom: true,
    toDOM: () => ['math-inline', 0],
    parseDOM: [{ tag: 'math-inline' }],
  },

  // :: NodeSpec A block math element.
  math_block: {
    group: 'block',
    content: 'text*',
    block: true,
    draggable: true,
    atom: true,
    toDOM: () => ['math-block', 0],
    parseDOM: [{ tag: 'math-block' }],
  },
}

const listNodes = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block',
  },
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block',
  },
  list_item: {
    ...listItem,
    content: 'paragraph block*',
  },
}

export default {
  ...defaultNodes,
  ...listNodes,
}
