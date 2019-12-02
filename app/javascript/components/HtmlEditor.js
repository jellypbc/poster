import React from 'react'
// import _ from 'lodash'
import debounce from 'lodash/debounce'
import { DOMParser, DOMSerializer } from 'prosemirror-model'

import Editor from './Editor'

const parser = schema => {
  const parser = DOMParser.fromSchema(schema)

  return content => {
    const container = document.createElement('article')
    container.innerHTML = content

    return parser.parse(container)
  }
}

const serializer = schema => {
  const serializer = DOMSerializer.fromSchema(schema)

  return doc => {
    const container = document.createElement('article')
    container.appendChild(serializer.serializeFragment(doc.content))

    return container.innerHTML
  }
}

class HtmlEditor extends React.Component {
  componentWillMount () {
    const { value, onChange, options } = this.props
    const { schema } = options

    const parse = parser(schema)
    const serialize = serializer(schema)

    options.doc = parse(value)

    this.wrapOnChangeToDebounce = debounce(doc =>  {
      console.log("dodoggogo")
      onChange(serialize(doc))
    }, 2000, { maxWait: 2000 })
  }

  combineCindyWithOnChange(doc) {
    const { onChange, setCindy, options } = this.props
    const { schema } = options

    const serialize = serializer(schema)

    setCindy(true)
    onChange(serialize(doc))

    // this.thing(doc)
  }

  // todo: come back to this later, add timeout gate to
  // debounce onchange events
  thing = (doc) => debounce(console.log('hi'), 500 )

  render () {
    const {
      autoFocus,
      options,
      attributes,
      render,
      nodeViews
    } = this.props

    return (
      <Editor
        autoFocus={autoFocus}
        options={options}
        attributes={attributes}
        render={render}
        // onChange={this.wrapOnChangeToDebounce}
        onChange={(doc) => this.combineCindyWithOnChange(doc)}
        nodeViews={nodeViews}
      />
    )
  }
}

export default HtmlEditor
