import React from 'react'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'
import {
  collab,
  receiveTransaction,
  sendableSteps,
  getVersion,
} from 'prosemirror-collab'

import {GET, POST} from "./editor-config/collab/http"
import {Reporter} from "./editor-config/collab/reporter"

import {recreateTransform} from "./editor-config/collab/recreate"
import {Merge, mergeTransforms} from "./editor-config/collab/recreate"

// import applyDevTools from 'prosemirror-dev-tools'
const report = new Reporter()

const reactPropsKey = new PluginKey('reactProps')

class Editor extends React.Component {
  constructor(props) {
    super(props)
    const { field } = props
    console.log(field.toUpperCase() + ' EDITOR PROPS', props)

    this.editorRef = React.createRef()

    const getView = () => this.view

    const authority = this.props.authority

    authority.onNewSteps.push(
      function () {
        let newData = authority.stepsSince(getVersion(this.view.state))
        this.view.dispatch(
          receiveTransaction(this.view.state, newData.steps, newData.clientIDs)
        )
      }.bind(this)
    )

    this.view = new EditorView(null, {
      // prosemirror options = { plugins, schema, comments: { comments: [] } }
      state: EditorState.create({
        ...props.options,
        field: props.field,
        plugins: props.options.setupPlugins(getView, authority, props, reactPropsKey),
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

        // auth
        let sendable = sendableSteps(state)
        console.log('>>> sendable', sendable)

        if (sendable)
          authority.receiveSteps(
            sendable.version,
            sendable.steps,
            sendable.clientID
          )
        // console.log('$$$', this.view.state)

        console.log('[' + this.props.field + 'authority]', authority)
        this.forceUpdate()
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })

    // applyDevTools(this.view)
  }

  componentDidMount(prevProps, prevState) {
    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
  }

  componentWillUnmount() {
    console.log('unmounting!')
    return () => this.editorRef.current.destroy()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (snapshot) {
      // APPLY THE TRANSACTION TO THE CURRENT VIEW STATE

      // ============================================================
      // Option 1
      // const state = EditorState.create({
      //   ...this.props.options,
      //   plugins: this.props.options.setupPlugins(
      //     this.view,
      //     this.props.authority,
      //     this.props,
      //     reactPropsKey
      //   ),
      // })
      // this.view.state = state
      // this.view.state.doc = this.props.options.doc
      // ============================================================
      // option 2
      // this.view.state.doc = this.props.authority.doc
      // this.view.updateState(this.view.state);
      // ============================================================

      // option 3
      // take the new doc from props.authority.doc, merge my local changes into auth, trigger redraw

      console.log('>>>----------------------------')
      console.log('>>> this.props.authority', this.props.authority)
      const startDoc = this.view.state.doc
      const endDoc = this.props.authority.doc

      console.log('>>startDoc, ', startDoc)
      console.log('>>endDoc, ', endDoc)

      let tr = recreateTransform(
        startDoc,
        endDoc,
        true, // Whether step types other than ReplaceStep are allowed.
        false // Whether diffs in text nodes should cover entire words.
      )
      console.log(">>> tr", tr)
      console.log('this view state', this.view.state)

      // const { newstate } = this.view.state.applyTransaction(
      //   tr
      // )
      // console.log("3333", newstate)

      // this.view.updateState(this.view.state)

      // let sendable = sendableSteps(state)
      // {clientID: '', steps: [], version}

      // const version = getVersion(this.view.state)
      // console.log('version', version)
      let sendable = {steps: tr.steps, clientID: this.props.authority.stepClientIDs[0], version: tr.steps.length}
      console.log('>>> new sendable', sendable)

      if (sendable)
        this.props.authority.receiveSteps(
          sendable.version,
          sendable.steps,
          sendable.clientID
        )
        console.log('new auth', this.props.authority)
        // this.view.updateState(this.view.state)
        // this.view.updateState(state)

      // tr.step()
      // const state = this.view.state.apply(tr)
      // console.log('new state', state)
      this.view.state.doc = this.props.authority.doc
      this.view.updateState(this.view.state)
      this.forceUpdate()


      // const newState = this.view.state.apply(tr)
      // this.view.updateState(newState)

      // const thing = this.props.authority.receiveSteps(tr)

    }

    this.editorRef.current.appendChild(this.view.dom)
    if (this.props.autoFocus) this.view.focus()
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
        <code>body:{this.props.post.data.attributes.body}</code>
        <br />
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
