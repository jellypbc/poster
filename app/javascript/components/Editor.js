import React from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { commentPluginKey } from './editor-config/plugin-comment'

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    const { field } = props
    console.log(field.toUpperCase() + ' EDITOR PROPS', props)

    this.editorRef = React.createRef()

    const getView = () => this.view

    const url = props.post.data.attributes.collab_url
    const id = props.post.data.id

    // 1. new ydoc
    const ydoc = new Y.Doc()

    // 2. load from cached indexdb
    const indexeddbProvider = new IndexeddbPersistence(id, ydoc)
    indexeddbProvider.whenSynced.then(() => {
      console.log('[1] view.state', this.view.state)
      // if there is no doc
      if (this.view.state.doc != this.props.options.doc)
        this.view.state.doc = this.props.options.doc
      this.view.updateState(this.view.state)
      // console.log('props doc', this.props.options.doc)
    })

    const provider = new WebsocketProvider(url, id, ydoc) // 3. sync clients with y-websocket provider
    const type = ydoc.getXmlFragment(id) // 4. set shared type
    const plugins = props.options.setupPlugins(getView, type, provider) // 5. set up plugins

    console.log('>>>>> type', type)
    // console.log('>>>>> provider', provider)

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        field: props.field,
        plugins: plugins,
        awareness: provider.awareness,
        ydoc: ydoc,
      }),
      dispatchTransaction: (transaction) => {
        // console.log("[3] dispatching", transaction)
        // console.log('[3] this.view', this.view)
        const oldComments = commentPluginKey.getState(this.view.state)

        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        )

        const newComments = commentPluginKey.getState(state)
        if (
          transactions.some((tr) => tr.docChanged) ||
          newComments !== oldComments
        ) {
          this.props.onChange(state.doc, state, props.field)
        }

        // this.props.onChange(state.doc, state, props.field)
        this.view.updateState(state)
        this.forceUpdate()
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })

    console.log('[2] this.view.init', this.view)
  }

  componentDidMount() {
    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      //   // console.log(">>>> snapshot componentDidUpdate", snapshot)
      //   console.log('>>>>>>>>>>>>> componentDidUpdate this.props', this.props)

      //   this.view.state.doc = this.props.options.doc
      //   this.view.state.doc.comments = {
      //     comments: this.props.post.data.attributes.body_comments,
      //   }

      //   const commentState = commentPluginKey.getState(this.view.state)
      //   console.log('commentState', commentState)

      //   this.view.updateState(this.view.state)

      console.log('>>>>>>>>>>>>> componentDidUpdate new view', this.view)
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.post != prevProps.post) {
      return true
    }
    return null
  }

  render() {
    // const editor = <div ref={this.editorRef} />
    const editor = (
      <div>
        {/*<code>body:{this.props.post.data.attributes.body}</code>*/}
        {/*<br />*/}
        <code>props options length:{this.props.options.doc.content.size}</code>
        <br />
        <div ref={this.editorRef} />
      </div>
    )

    return this.props.render
      ? this.props.render({
          editor,
          view: this.view,
        })
      : editor
  }
}

export default Editor
