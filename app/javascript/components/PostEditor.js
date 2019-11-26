import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import HtmlEditor from './HtmlEditor'
import Floater from './Floater'
import MenuBar from './MenuBar'

// import { options, menu } from './config/index'
import { options, menu } from '@aeaton/react-prosemirror-config-default'

import superagent from 'superagent'

class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      post: this.props.post,
      doc: {}
    }
  }

  componentDidMount(){
    console.log(this.props)
  }

  handleFormSubmit(e){
    e.preventDefault();
    var { post } = this.props
    var token = document.head.querySelector("[name~=csrf-token][content]").content

    // var url = post.data.attributes.form_url || '/posts'
    if (post && post.data && post.data.attributes) {
      var url = post.data.attributes.form_url
    } else {
      var url = '/posts'
    }


    // build the data
    var postBody = JSON.stringify(this.state.doc, null, 2)

    var data = {
      body: postBody
    }


    // send the request
    if (post.data) {
      superagent
        .put(url)
        .send(data)
        .set('X-CSRF-Token', token)
        .set('accept', 'application/json')
        .end((err, res) => {
          var redirect = JSON.parse(res.text).redirect_to
          window.location.href = redirect;
        })

    } else {
      superagent
        .post(url)
        .send(data)
        .set('X-CSRF-Token', token)
        .set('accept', 'application/json')
        .end((err, res) => {
          var redirect = JSON.parse(res.text).redirect_to
          window.location.href = redirect;
        })
    }

  }

  render(){
    var { post } = this.props

    const Container = styled('div')`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `

    const Input = styled('div')`
      width: 100%;
      height: 50%;
      overflow-y: auto;
    `

    const editorStyle = {
    };

    let elem = document.getElementById('editor')

    var postXML = post.data.attributes.body
    console.log(postXML)

    return (
      <div>

        <HtmlEditor
          onChange={doc => this.setState({ doc })}
          value={postXML}
          options={options}
          autoFocus
          render={({ editor, view }) => (
            <div style={editorStyle}>
              <MenuBar view={view} />

              <Floater view={view}>
                <MenuBar menu={{ marks: menu.marks }} view={view} />
              </Floater>

              {editor}
            </div>
          )}
        />

        <button onClick={this.handleFormSubmit.bind(this)}>Submit</button>

      </div>
    )
  }
}

export default PostEditor
