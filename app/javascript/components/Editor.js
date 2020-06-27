import React from 'react'
import { EditorState, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Step } from 'prosemirror-transform'
import { pluginKey as commentPluginKey } from './editor-config/comments'
// import applyDevTools from 'prosemirror-dev-tools'
import {collab, receiveTransaction, sendableSteps, getVersion} from "prosemirror-collab"

class Editor extends React.Component {
  constructor(props) {
    super(props)
    const { field } = props
    console.log(field.toUpperCase() + ' EDITOR PROPS', props)

    this.editorRef = React.createRef()

    const getView = () => this.view

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        field: props.field,
        comments: props.options.doc.comments,
        plugins: props.options.setupPlugins(getView),
      }),
      dispatchTransaction: (transaction) => {
        // console.log(">> disptaching transaction", transaction)

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
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })

    // applyDevTools(this.view)
  }

  componentWillUnmount() {
    this.view.destroy()
  }

  componentDidMount() {
    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      const oldViewFocused = this.view.hasFocus()

      console.log(this.view.state)

      // this.view.state.doc = this.props.options.doc
      // const newState = EditorState.create({
      //   ...this.props.options,
      //   field: this.props.field,
      //   comments: this.props.options.comments,
      //   selection: this.view.state.selection,
      //   plugins: this.view.state.plugins,
      // })
      // this.view.updateState(newState)


      let oldComments = commentPluginKey.getState(this.view.state)
      // console.log('oldComments', oldComments)

      // let newComments = this
      // let newState = this.view.state.reconfigure({
      //   plugins: this.view.state.plugins.concat([newComments])
      // })
      // this.view.updateState(newState)



      // #### strategy: use a action dispatch pattern for reloading the comment plugin
      // 1.
      // pm-Collab has a receiveTransaction
      // let tr = receiveTransaction(this.state.edit, data.steps.map(j => Step.fromJSON(schema, j)), data.clientIDs)
      // 2. dispatch the receive action to the comment plugin
      // tr.setMeta(commentPlugin, {
      //   type: "receive",
      //   version: data.commentVersion,
      //   events: data.comment,
      //   sent: 0
      // })

      console.log('oldViewFocused', oldViewFocused)
      if (oldViewFocused) { this.view.focus() }
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // if (this.props.post != prevProps.post) {

    // console.log('props', this.props.options.doc.comments)
    // console.log('prevprops', prevProps.options.doc.comments)
    // console.log(this.props.options.doc.concat(items...: any)mments != prevProps.options.doc.comments)

    // if (prevProps.options.doc.comments != this.view.state.doc.comments) {
    if (this.props.post != prevProps.post) {
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
