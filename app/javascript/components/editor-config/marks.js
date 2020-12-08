const emDOM = ['em', 0],
  strongDOM = ['strong', 0],
  codeDOM = ['code', 0]

const defaultMarks = {
  // :: MarkSpec A link. Has `href`, `title`, and `target` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  link: {
    attrs: {
      href: {},
      title: { default: null },
      target: { default: '_blank' },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(dom) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
            target: dom.getAttribute('target'),
          }
        },
      },
    ],
    toDOM(node) {
      let { href, title, target } = node.attrs
      return ['a', { href, title, target }, 0]
    },
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM() {
      return emDOM
    },
  },

  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {
        tag: 'b',
        getAttrs: (node) => node.style.fontWeight != 'normal' && null,
      },
      {
        style: 'font-weight',
        getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
      },
    ],
    toDOM() {
      return strongDOM
    },
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM
    },
  },
}

const subscript = {
  excludes: 'superscript',
  parseDOM: [{ tag: 'sub' }, { style: 'vertical-align=sub' }],
  toDOM: () => ['sub'],
}

const superscript = {
  excludes: 'subscript',
  parseDOM: [{ tag: 'sup' }, { style: 'vertical-align=super' }],
  toDOM: () => ['sup'],
}

const strikethrough = {
  parseDOM: [{ tag: 'span.strikethrough' }],
  toDOM: () => [
    'span',
    {
      class: 'strikethrough',
    },
  ],
}

const underline = {
  parseDOM: [{ tag: 'span.underline' }],
  toDOM: () => [
    'span',
    {
      class: 'underline',
    },
  ],
}

export default {
  ...defaultMarks,
  subscript,
  superscript,
  strikethrough,
  underline,
}
