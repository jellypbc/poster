/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { createConsumer } from "@rails/actioncable"
import superagent from 'superagent'
import debounce from 'lodash/debounce'

import Editor from './Editor'
import Floater from './Floater'
import MenuBar from './MenuBar'
import PostMasthead from './PostMasthead'
import ChangesIndicator from './ChangesIndicator'
import PostProcessingPlaceholder from './PostProcessingPlaceholder'
import { options, menu } from './config/index'

import {
	pluginKey as commentPluginKey,
	serialize as serializeComment,
} from './config/plugin-comment'

import {
  getTimestamp, getIsNewPost, createParser, createSerializer
} from './postUtils'

import 'prosemirror-view/style/prosemirror.css'


class PostEditor extends React.Component {
	constructor(props) {
		super(props)

		console.log('POSTEDITOR PROPS', props)

		// TODO: Whole thing needs to reinit if props.post changes identity,
		//       which can be done with useEffect or componentDidUpdate
		// TODO: should prevent closing tab while hasChanges state is true
    // TODO: move post out of state once actioncable loading is moved into
    //       a container component

		this.state = {
      post: this.props.post || null,
			isLoading: false, // is sending request to server
			hasChanges: false, // editor has changes (actual onChange may be debounced)
			error: null, // last server error, if any
			errorAt: null, // string or null
			lastSavedAt: getTimestamp('updated_at', props.post), // string or null
			lastUnsavedChangeAt: null, // Date object or null, used to track dirty state
      isProcessing: this.props.isProcessing || false, // TODO: move this into container
		}

    const schema = options.schema
    this.parse = createParser(schema)
    this.serialize = createSerializer(schema)
    const postBody = this.state.post.data.attributes.body
    const pluginState = JSON.parse(this.state.post.data.attributes.plugins)
    options.doc = this.parse(postBody) // TODO: don't mutate "options"
    options.doc.comments = { comments: pluginState.comments } // TODO: generalize plugin state restoration
	}

  componentDidMount(){
    var post = document.getElementById('post').getAttribute("data-post-id")
    var cableHost = this.state.post.data.attributes.cable_url
    var cable = createConsumer(cableHost)

    cable.subscriptions.create({channel: "PostsChannel", post_id: post}, {
      connected() {
        console.log("connected to PostsChannel")
      },

      received: function(data) {
        this.setState( state => ({
          post: data,
          isProcessing: false
        }))
      }.bind(this)
    })

    // Remove the static placeholder content once component renders
    var placeholder = document.getElementsByClassName('placeholder-content')[0]
    placeholder.remove()
  }

  handleChange = (doc, docState) => {
    // Tell the parent component there are changes ("dirty state")
    // and also call debounced full change handler.
    this.setState({ lastUnsavedChangeAt: new Date() })
    this.handleFullChange(doc, docState) // this is debounced to save bandwidth
  }

  // Debounces change handler so user has to stop typing to save,
  // but also adds maxWait so that if they type continuously, changes will
  // still be saved every so often.
  //
  // Both network and parsing are expensive, combine component with parent?
  // TODO: Should debouncing happen around parent's network call or here?
  handleFullChange = debounce(
    (doc, docState) => {
      const onChange = this.updatePost
      onChange(this.serialize(doc), docState)
    },
    350,
    { maxWait: 1000 }
  )

	updatePost = (doc, docState) => {
		// do not read from this.state after setState, it will not update until rerender
		this.setState({ isLoading: true })

		var { post } = this.state
		const isNewPost = getIsNewPost(post)

		var url = isNewPost ? '/posts' : post.data.attributes.form_url

		const commentState = commentPluginKey.getState(docState)
		const newCommentsToSave = commentState.unsent.map(serializeComment)
		// TODO: serialize JSON on server instead of parsing string?
		const oldPluginState = JSON.parse(post.data.attributes.plugins)
		const comments = [...(oldPluginState.comments || []), ...newCommentsToSave]

		var data = {
			body: doc,
			plugins: JSON.stringify({ comments }),
		}
		var method = isNewPost ? 'post' : 'put'
		var token = document.head.querySelector('[name~=csrf-token][content]')
			.content

		superagent[method](url)
			.send(data)
			.set('X-CSRF-Token', token)
			.set('accept', 'application/json')
			.end((err, res) => {
				console.log({ res, err }) // DEBUG SAVE
				// res is just showing a redirect instead of full data,
				// use the browser timestamp instead of new updated_at
				const now = new Date().toISOString()
				this.setState(state => ({
					isLoading: false,
					error: err ? err : null,
					errorAt: err ? now : null,
					lastSavedAt: err ? state.lastSavedAt : now,
				}))
			})
	}

  renderPost(){
    const {
      post,
      error,
      errorAt,
      isLoading,
      lastSavedAt,
      lastUnsavedChangeAt,
    } = this.state
    const isNewPost = getIsNewPost(post)
    const postBody = post.data.attributes.body
    const pluginState = JSON.parse(post.data.attributes.plugins)
    const lastSavedAtDate = new Date(lastSavedAt) // convert to date object
    const hasUnsavedChanges = lastSavedAtDate < lastUnsavedChangeAt

    return (
      <div>
        <PostMasthead post={post}/>

        {error ? (
          <p className="post__error">
            <strong>{errorAt}</strong>: {error}
          </p>
        ) : null}

        <Editor
          autoFocus
          options={options}
          onChange={this.handleChange}
          html={postBody}
          pluginState={pluginState}
          render={({ editor, view }) => (
            <div>
              <Floater view={view}>
                <MenuBar menu={menu} view={view} />
              </Floater>
              <div className="post-editor">{editor}</div>
            </div>
          )}
        />

        <ChangesIndicator
          isLoading={isLoading}
          hasUnsavedChanges={hasUnsavedChanges}
          isNewPost={isNewPost}
          lastSavedAtDate={lastSavedAtDate}
        />
      </div>
    )
  }

	render() {
		return (
			<div>
        { this.state.isProcessing ?
          <PostProcessingPlaceholder /> :
          this.renderPost()
        }
      </div>
		)
	}
}

export default PostEditor
