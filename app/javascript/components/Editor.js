import React, { useState, useRef, useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { commentPluginKey } from './editor-config/comments'
// import applyDevTools from 'prosemirror-dev-tools'

function useForceUpdate() {
  const [, setValue] = useState(0)
  return () => setValue((value) => ++value)
}

export default function Editor(props) {
  const {
    post,
    options,
    onChange,
    isEditable,
    render,
    field,
    autoFocus,
  } = props

  console.log(field.toUpperCase() + ' EDITOR PROPS', props)

  const forceUpdate = useForceUpdate()

  const editorRef = useRef()

  const getView = () => view

  const view = new EditorView(null, {
    state: EditorState.create({
      schema: options.schema,
      doc: options.doc,
      plugins: options.setupPlugins(getView),
      field: field,
    }),
    dispatchTransaction: (transaction) => {
      const oldComments = commentPluginKey.getState(view.state)
      const { state, transactions } = view.state.applyTransaction(transaction)
      view.updateState(state)
      const newComments = commentPluginKey.getState(state)
      if (
        transactions.some((tr) => tr.docChanged) ||
        newComments !== oldComments
      ) {
        onChange(state.doc, state, field)
      }
      forceUpdate()
    },
    editable: function (state) {
      return isEditable
    },
    handleDOMEvents: function (view, event) {
      return true
    },
  })

  // applyDevTools(view)

  useEffect(() => {
    editorRef.current.appendChild(view.dom)
    if (autoFocus) view.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    view.state.doc = options.doc
    const newState = EditorState.create({
      schema: options.schema,
      doc: options.doc,
      plugins: view.state.plugins,
      field: field,
      selection: view.state.selection,
    })
    view.updateState(newState)
    view.focus()

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  const editor = <div ref={editorRef} />

  return render ? render({ editor, view }) : editor
}
