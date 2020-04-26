import React from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'
import applyDevTools from 'prosemirror-dev-tools'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    // console.log('EDITOR PROPS', props)

    this.editorRef = React.createRef()

    const getView = () => this.view

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        plugins: props.options.setupPlugins(getView, props.post.data.slug),
      }),
      dispatchTransaction: (transaction) => {
        console.log('>>>>>>>>>>>>>>> editor dispatch')
        const oldComments = commentPluginKey.getState(this.view.state)

        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        )
        console.log('state.decorations', state)
        console.log('state.decorations', this.view.state)

        this.view.updateState(state)

        const newComments = commentPluginKey.getState(state)

        if (
          transactions.some((tr) => tr.docChanged) ||
          newComments !== oldComments
        ) {
          this.props.onChange(state.doc, state)
        }
        this.forceUpdate()
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })

    applyDevTools(this.view)
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
