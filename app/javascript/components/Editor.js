import React from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'
// import applyDevTools from 'prosemirror-dev-tools'

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

        // this.props.onChange(state.doc, state, props.field)
        this.forceUpdate()
      },
      editable: function (state) {
        return this.props.isEditable
      }.bind(this),
    })

    // applyDevTools(this.view)
  }

  componentDidMount() {
    this.editorRef.current.appendChild(this.view.dom)
    // if (this.props.autoFocus) this.view.focus()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      //   // console.log(">>>> snapshot componentDidUpdate", snapshot)
      //   console.log('>>>>>>>>>>>>> componentDidUpdate this.props', this.props)

      console.log('>>>> new props ' + this.props.field, this.props)

      this.view.state.doc = this.props.options.doc
      // this.view.state.doc.comments = {
      //   comments: this.props.options.doc.comments
      // }

      const commentState = commentPluginKey.getState(this.view.state)
      console.log('commentState' + this.props.field, commentState)

      const plugins = this.view.state.plugins

      const newState = EditorState.create({
        ...this.props.options,
        field: this.props.field,
        plugins: plugins,
      })

      console.log('>>>> newState ' + this.props.field, newState)

      this.view.updateState(newState)
      // this.view.updateState(this.view.state)

      // console.log('>>>>>>>>>>>>> componentDidUpdate new view', this.view)
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
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
