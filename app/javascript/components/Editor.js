import React from 'react'
import { DOMParser, DOMSerializer } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { pluginKey as commentPluginKey } from './config/plugin-comment'

class Editor extends React.Component {
	constructor(props) {
		super(props)

		this.editorRef = React.createRef()

		console.log('EDITOR OPTIONS', props.options)

		this.view = new EditorView(null, {
			state: EditorState.create(props.options),
			dispatchTransaction: transaction => {
				const oldComments = commentPluginKey.getState(this.view.state)

				const { state, transactions } = this.view.state.applyTransaction(
					transaction
				)

				this.view.updateState(state)

				const newComments = commentPluginKey.getState(state)

				// TODO: docChanged is for tx with steps only
				// get comments to also call onChange, but ignore selection changes?
				if (
					transactions.some(tr => tr.docChanged) ||
					newComments !== oldComments
				) {
					this.props.onChange(state.doc, state)
				}

				// TODO: why?
				this.forceUpdate()
			},
			attributes: this.props.attributes,
			nodeViews: this.props.nodeViews,
		})
	}

	componentDidMount() {
		this.editorRef.current.appendChild(this.view.dom)

		if (this.props.autoFocus) {
			this.view.focus()
		}
	}

	render() {
		const editor = <div ref={this.editorRef} />

		return this.props.render
			? this.props.render({
					editor,
					view: this.view,
			  })
			: editor
	}
}

export default Editor
