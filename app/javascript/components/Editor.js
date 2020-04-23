import React from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'
// import applyDevTools from "prosemirror-dev-tools";

class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.editorRef = React.createRef()

    console.log('EDITOR PROPS', props)

    const getView = () => this.view

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        plugins: props.options.setupPlugins(getView, props.post.data.slug),
      }),
      dispatchTransaction: (transaction) => {
        const oldComments = commentPluginKey.getState(this.view.state)

        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        )

        this.view.updateState(state)

        const newComments = commentPluginKey.getState(state)

        // TODO: docChanged is for tx with steps only
        // get comments to also call onChange, but ignore selection changes?
        if (
          transactions.some((tr) => tr.docChanged) ||
          newComments !== oldComments
        ) {
          this.props.onChange(state.doc, state)
        }

        // TODO: why?
        this.forceUpdate()
      },
      nodeViews: this.props.nodeViews,
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })

    // applyDevTools(this.view)
  }

  componentDidMount() {
    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
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
