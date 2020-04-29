import React from 'react'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'
import applyDevTools from 'prosemirror-dev-tools'

const reactPropsKey = new PluginKey('reactProps')

class Editor extends React.Component {
  constructor(props) {
    super(props)
    console.log('EDITOR PROPS', props)

    this.editorRef = React.createRef()
    this.view = React.createRef()

    const getView = () => this.view.current

    this.view.current = new EditorView(this.editorRef, {
      state: EditorState.create({
        ...props.options,
        plugins: props.options.setupPlugins(getView, props, reactPropsKey),
      }),
      dispatchTransaction: (transaction) => {
        const oldComments = commentPluginKey.getState(this.view.current.state)
        const {
          state,
          transactions,
        } = this.view.current.state.applyTransaction(transaction)
        this.view.current.updateState(state)
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

    // applyDevTools(this.view)
  }

  componentDidMount() {
    // console.log("this.editorRef", this.editorRef)
    // console.log("this.view", this.view)
    // console.log(this.view.current.dom)
    this.editorRef.current.appendChild(this.view.current.dom)
    // if (this.props.autoFocus) this.view.focus()
  }

  componentWillReceiveProps() {
    console.log('this.view', this.view)
    console.log('this.editorRef', this.editorRef)
    const tr = this.view.current.state.tr.setMeta(reactPropsKey, this.props)
    console.log('tr', tr)
    this.view.current.dispatch(tr)
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
