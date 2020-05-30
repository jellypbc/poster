import React from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ySyncPlugin } from './editor-config/collab/sync-plugin'
import { yUndoPlugin, undo, redo } from './editor-config/collab/undo-plugin'
import { yCursorPlugin } from './editor-config/collab/cursor-plugin'
import { keymap } from 'prosemirror-keymap'
import { IndexeddbPersistence } from 'y-indexeddb'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    const { field } = props
    console.log(field.toUpperCase() + ' EDITOR PROPS', props)

    this.editorRef = React.createRef()

    const getView = () => this.view

    // const url = 'ws://localhost:1234'
    const url = 'ws://boiling-springs-06233.herokuapp.com'
    // const url = 'wss://demos.yjs.dev'
    const id = props.post.data.id

    // 1. new ydoc
    const ydoc = new Y.Doc()

    // 2. load from cached indexdb
    const indexeddbProvider = new IndexeddbPersistence('count-demo', ydoc)
    indexeddbProvider.whenSynced.then(() => {
      console.log('>>>>> loaded data from indexed db')
      this.view.state.doc = this.props.options.doc
      this.view.updateState(this.view.state)
    })

    // 3. sync clients with y-websocket provider
    const provider = new WebsocketProvider(url, id, ydoc)

    // 4. set shared type
    // const type = ydoc.get(id, Y.XmlFragment)
    const type = ydoc.getXmlFragment(id)

    const plugins = props.options.setupPlugins(getView).concat([
      ySyncPlugin(type),
      yCursorPlugin(provider.awareness),
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
      }),
    ])

    console.log('>>>>> type', type)
    console.log('>>>>> provider', provider)

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        plugins: plugins,
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

        this.props.onChange(state.doc, state, props.field)
        this.forceUpdate()
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })
  }

  componentDidMount() {
    this.view.state.doc = this.props.options.doc

    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      // console.log(">>>> snapshot componentDidUpdate", snapshot)
      console.log('>>>> this.props', this.props)

      this.view.state.doc = this.props.options.doc

      const commentState = commentPluginKey.getState(this.view.state)
      console.log('commentState', commentState)

      this.view.updateState(this.view.state)

      console.log('new view', this.view)
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.post != prevProps.post) {
      const newDoc = this.props.post.data.attributes.body
      return newDoc
    }
    return null
  }

  render() {
    // const editor = <div ref={this.editorRef} />
    const editor = (
      <div>
        {/*<code>body:{this.props.post.data.attributes.body}</code>*/}
        {/*<br />*/}
        <code>options length:{this.props.options.doc.content.size}</code>
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
