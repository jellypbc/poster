import React from "react"
import PropTypes from "prop-types"

import {schema} from "prosemirror-schema-basic"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser} from "prosemirror-model"

import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"

class Editor extends React.Component {

  constructor(props){
    super(props);
    this.state = { post: this.props.post }
  }

  render () {

  	let elem = document.getElementById('editor')

		let doc = schema.node("doc", null, [
		  schema.node("paragraph", null, [schema.text("this is a prosemirror editor.")]),
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

    console.log(this.state)

    return (
      <React.Fragment>
        <p>hello i am the component</p>
        <p>ID: {this.state.post.data.id}</p>
        <p>body: {this.state.post.data.attributes.body}</p>
      </React.Fragment>
    );
  }
}

export default Editor;
