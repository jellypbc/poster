import React, { useState, useRef, useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { commentPluginKey } from './editor-config/comments'
// import applyDevTools from 'prosemirror-dev-tools'

// function useForceUpdate() {
//   const [, setValue] = useState(0)
//   return () => setValue((value) => ++value)
// }

// export default function Editor(props) {
//   const {
//     post,
//     options,
//     onChange,
//     isEditable,
//     render,
//     field,
//     autoFocus,
//   } = props

//   console.log(field.toUpperCase() + ' EDITOR PROPS', props)
//   const forceUpdate = useForceUpdate()

//   const editorRef = useRef()

//   const getView = () => view

//   const view = new EditorView(null, {
//     state: EditorState.create({
//       schema: options.schema,
//       doc: options.doc,
//       plugins: options.setupPlugins(getView),
//       field: field,
//     }),
//     dispatchTransaction: (transaction) => {
//       const oldComments = commentPluginKey.getState(view.state)
//       const { state, transactions } = view.state.applyTransaction(transaction)
//       view.updateState(state)
//       const newComments = commentPluginKey.getState(state)
//       if (
//         transactions.some((tr) => tr.docChanged) ||
//         newComments !== oldComments
//       ) {
//         onChange(state.doc, state, field)
//       }
//       forceUpdate()
//     },
//     editable: function (state) {
//       return isEditable
//     },
//     handleDOMEvents: function (view, event) {
//       return true
//     },
//   })

//   // applyDevTools(view)

//   useEffect(() => {
//     editorRef.current.appendChild(view.dom)
//     if (autoFocus) view.focus()
//   }, [])

//   useEffect(() => {
//     view.state.doc = options.doc
//     const newState = EditorState.create({
//       schema: options.schema,
//       doc: options.doc,
//       plugins: view.state.plugins,
//       field: field,
//       selection: view.state.selection,
//     })
//     view.updateState(newState)
//     view.focus()
//     return () => view.destroy
//   }, [props]) // idk what goes here instead of props :(

//   const editor = <div ref={editorRef} />

//   return render ? render({ editor, view: view }) : editor
// }

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
    })

    // applyDevTools(this.view)
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
