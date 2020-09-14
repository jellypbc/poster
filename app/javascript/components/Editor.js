import React from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { commentPluginKey } from './editor-config/comments'
import applyDevTools from 'prosemirror-dev-tools'
import FootnoteView from './FootnoteView'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    const { field } = props
    console.log(field.toUpperCase() + ' EDITOR PROPS', props)

    this.editorRef = React.createRef()

    const getView = () => this.view

    // var that = this
    // var edit = that.isEditable

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        field: props.field,
        plugins: props.options.setupPlugins(getView),
      }),
      dispatchTransaction: (transaction) => {
        const oldComments = commentPluginKey.getState(this.view.state)

        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        )

        this.view.updateState(state)

        const newComments = commentPluginKey.getState(state)

        if (
          transactions.some((tr) => tr.docChanged) ||
          newComments !== oldComments
        ) {
          this.props.onChange(state.doc, state, props.field)
        }

        this.forceUpdate()
        // this.view.focus()
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
      handleDOMEvents: function (view, event) {
        console.log('eve', event)
        return true
      },
      nodeViews: {
        // var edit = that.isEditable
        // var edit = store.getState.currentUser
        // if edit { edit = true }
        footnote(node, view, getPos) {
          return new FootnoteView(node, view, getPos)
        },
      },
    })

    applyDevTools(this.view)
  }

  componentDidMount() {
    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
  }

  componentWillUnmount() {
    this.view.destroy()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.view.state.doc = this.props.options.doc
      const newState = EditorState.create({
        ...this.props.options,
        field: this.props.field,
        plugins: this.view.state.plugins,
        selection: this.view.state.selection,
      })
      this.view.updateState(newState)
      this.view.focus()
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.post !== prevProps.post) {
      return this.props
    }
    return null
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
