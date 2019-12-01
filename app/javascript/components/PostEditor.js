import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import HtmlEditor from './HtmlEditor'
import Floater from './Floater'
import MenuBar from './MenuBar'

import { options, menu } from './config/index'

import superagent from 'superagent'

class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      post: this.props.post,
      loading: false,
      doc: {}
    }
  }

  componentDidMount(){
    console.log(this.props)
  }

  handleFormChange(doc) {
    this.setState({ doc })

    var { post } = this.props
    var url = (post && post.data && post.data.attributes) ?
      post.data.attributes.form_url :
      '/posts'
    var data = { body: this.state.doc }
    var method = (post && post.data && post.data.attributes) ?
      "put" :
      "post"
    var token = document.head
      .querySelector("[name~=csrf-token][content]")
      .content

    superagent[method](url)
      .send(data)
      .set('X-CSRF-Token', token)
      .set('accept', 'application/json')
      .end((err, res) => {
        this.setState({loading: false})
      })
  }

  render(){
    var { post } = this.props
    let elem = document.getElementById('editor')
    var postBody = post.data.attributes.body

    return (
      <div>
        <h1>am i typing?: {this.state.loading.toString()}</h1>
        <HtmlEditor
          onChange={(doc) => this.handleFormChange(doc)}
          setCindy={(boolean) => this.setState({loading: boolean})}
          value={postBody}
          options={options}
          autoFocus
          render={({ editor, view }) => (
            <div>
              <MenuBar view={view} />

              <Floater view={view}>
                <MenuBar menu={{ marks: menu.marks }} view={view} />
              </Floater>

              {editor}
            </div>
          )}
        />

        <div className={"loading-indicator " + (this.state.loading && "active")}>
          <i className="fa fa-circle" />
          <span>
            {this.state.loading ? "Saving..." : "Last saved x ago"}
          </span>
        </div>
      </div>
    )
  }
}

export default PostEditor;
