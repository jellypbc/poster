import React from "react"
import PropTypes from "prop-types"

import {schema} from "prosemirror-schema-basic"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"

import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"

import {DOMParser} from "prosemirror-model"
// import {EditorState} from "prosemirror-state"
// import {schema} from "prosemirror-schema-basic"

class Editor extends React.Component {
  render () {
  	let elem = document.getElementById('editor')

  	// let state = EditorState.create({schema})
		// let view = new EditorView(elem, {state})

		// let state = EditorState.create({schema})
		// let view = new EditorView(elem, {
		//   state,
		//   dispatchTransaction(transaction) {
		//   	console.log(transaction)
		//     console.log("Document size went from", transaction.before.content.size,
		//                 "to", transaction.doc.content.size)
		//     let newState = view.state.apply(transaction)
		//     view.updateState(newState)
		//   }
		// })
		let doc = schema.node("doc", null, [
		  schema.node("paragraph", null, [schema.text("One.")]),
		  schema.node("horizontal_rule"),
		  schema.node("paragraph", null, [schema.text("Two!")])
		])

		let state = EditorState.create({
		  doc,
		  plugins: [
		    history(),
		    keymap({"Mod-z": undo, "Mod-y": redo})
		  ]
		})
		// let view = new EditorView(elem, {state})
		let view = new EditorView(elem, {
			state,
			dispatchTransaction(transaction) {

				console.log(transaction.doc)
				console.log(transaction.doc.content.content[1])

				let newState = view.state.apply(transaction)
				view.updateState(newState)
			}
		})

    return (
      <React.Fragment>
        <p>render</p>
      </React.Fragment>
    );
  }
}

export default Editor;
