/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import debounce from 'lodash/debounce'
import { DOMParser, DOMSerializer } from 'prosemirror-model'

import Editor from './Editor'

const createParser = schema => {
	const parser = DOMParser.fromSchema(schema)

	return content => {
		const container = document.createElement('article')
		container.innerHTML = content

		return parser.parse(container)
	}
}

const createSerializer = schema => {
	const serializer = DOMSerializer.fromSchema(schema)

	return doc => {
		const container = document.createElement('article')
		container.appendChild(serializer.serializeFragment(doc.content))

		return container.innerHTML
	}
}

// TODO: Could this component be combined with Editor.js or PostEditor.js?

class HtmlEditor extends React.Component {
	constructor(props) {
		super(props)
		const { value, options } = props
		const { schema } = options

		this.parse = createParser(schema)
		this.serialize = createSerializer(schema)

		options.doc = this.parse(value) // TODO: don't mutate input prop
	}

	handleChange = doc => {
		// Tell the parent component there are changes ("dirty state")
		// and also call debounced full change handler.
		const { onHasChanges } = this.props

		onHasChanges() // don't debounce this, must save dirty state right away
		this.handleFullChange(doc) // this is debounced to save bandwidth
	}

	// Debounces change handler so user has to stop typing to save,
	// but also adds maxWait so that if they type continuously, changes will
	// still be saved every so often.
	//
	// Both network and parsing are expensive, combine component with parent?
	// TODO: Should debouncing happen around parent's network call or here?
	handleFullChange = debounce(
		doc => {
			const { onChange } = this.props
			onChange(this.serialize(doc))
		},
		350,
		{ maxWait: 1000 }
	)

	render() {
		const { autoFocus, options, attributes, render, nodeViews } = this.props

		return (
			<Editor
				autoFocus={autoFocus}
				options={options}
				attributes={attributes}
				render={render}
				onChange={this.handleChange}
				nodeViews={nodeViews}
			/>
		)
	}
}

export default HtmlEditor
