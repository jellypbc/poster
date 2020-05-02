/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { createConsumer } from '@rails/actioncable'
import superagent from 'superagent'
import debounce from 'lodash/debounce'
import sanitizeHtml from 'sanitize-html'

import { store } from './store'
import Editor from './Editor'
import Floater from './Floater'
import MenuBar from './MenuBar'
import PostMasthead from './PostMasthead'
import ChangesIndicator from './ChangesIndicator'
import PostProcessingPlaceholder from './PostProcessingPlaceholder'
import { options, menu, annotationMenu } from './editor-config/index'

import { pluginKey as commentPluginKey } from './editor-config/plugin-comment'

import {
  getTimestamp,
  getIsNewPost,
  createParser,
  createSerializer,
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
      user: this.props.currentUser || null,
      title: this.props.post.data.attributes.title || 'Give me a name',
      isLoading: false, // is sending request to server
      hasChanges: false, // editor has changes (actual onChange may be debounced)
      error: null, // last server error, if any
      errorAt: null, // string or null
      lastSavedAt: getTimestamp('updated_at', props.post), // string or null
      lastUnsavedChangeAt: null, // Date object or null, used to track dirty state
      isProcessing: this.props.isProcessing || false, // TODO: move this into container
      isEditable: this.props.editable || false,
    }

    const schema = options.schema
    this.parse = createParser(schema)
    this.serialize = createSerializer(schema)
  }

  componentDidMount() {
    var post = document.getElementById('post').getAttribute('data-post-id')
    var cableHost = this.state.post.data.attributes.cable_url
    var cable = createConsumer(cableHost)

    cable.subscriptions.create(
      { channel: 'PostsChannel', post_id: post },
      {
        connected() {},

        received: function (data) {
          this.setState((state) => ({
            post: data,
            isProcessing: false,
          }))
          this.updateURL()
        }.bind(this),
      }
    )

    store.dispatch({
      type: 'setCurrentPost',
      payload: this.props.post,
    })

    if (this.props.currentUser) {
      store.dispatch({
        type: 'setCurrentUser',
        payload: this.props.currentUser,
      })
    }

    this.removeStaticRenderPlaceholder()
  }

  removeStaticRenderPlaceholder = () => {
    var placeholder = document.getElementsByClassName('placeholder-content')[0]
    if (placeholder) placeholder.remove()
  }

  // Debounces change handler so user has to stop typing to save,
  // but also adds maxWait so that if they type continuously, changes will
  // still be saved every so often.
  debounceChanges = debounce(
    (doc, docState, onChange, field) => {
      onChange(this.serialize(doc), docState, field)
    },
    350,
    { maxWait: 1000 }
  )

  updateURL = () => {
    var title = sanitizeHtml(this.state.post.data.attributes.title, {
      allowedTags: [],
      allowedAttributes: {},
    })

    if (window.history.replaceState) {
      document.title = title
      window.history.replaceState(
        {},
        title,
        this.state.post.data.attributes.slug
      )
    }
  }

  handleChange = (doc, docState, field) => {
    this.setState({ lastUnsavedChangeAt: new Date() })
    this.debounceChanges(doc, docState, this.updatePost, field)
  }

  updatePost = (doc, docState, field) => {
    this.setState({ isLoading: true })
    const { post } = this.state
    const isNewPost = getIsNewPost(post)
    const comments = JSON.stringify(
      commentPluginKey.getState(docState).allComments()
    )
    const url = isNewPost ? '/posts' : post.data.attributes.form_url
    const method = isNewPost ? 'post' : 'put'
    const token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    let data = {}
    if (field === 'title') {
      data = {
        title: doc,
        comments: comments,
      }
    } else if (field === 'body') {
      data = {
        body: doc,
        comments: comments,
      }
    }

    this.submit(data, token, method, url, this.onSuccess)
  }

  onSuccess = (err, res) => {
    console.log({ res, err })
    const now = new Date().toISOString()
    this.setState((state) => ({
      isLoading: false,
      error: err ? err : null,
      errorAt: err ? now : null,
      lastSavedAt: err ? state.lastSavedAt : now,
    }))
    this.updateURL()
  }

  submit(data, token, method, url, onSuccess) {
    superagent[method](url)
      .send(data)
      .set('X-CSRF-Token', token)
      .set('accept', 'application/json')
      .end((err, res) => {
        onSuccess(err, res)
      })
  }

  renderTitleEditor = ({ editor, view }) => {
    const { isEditable } = this.state
    var menubar = isEditable ? menu : annotationMenu
    return (
      <div className="header">
        <div className="header-nav">
          <Floater view={view}>
            <MenuBar menu={menubar} view={view} />
          </Floater>
          <div className="title">
            <h1>{editor}</h1>
          </div>
        </div>
      </div>
    )
  }

  renderBodyEditor = ({ editor, view }) => {
    const { isEditable } = this.state
    var menubar = isEditable ? menu : annotationMenu
    return (
      <div>
        <Floater view={view}>
          <MenuBar menu={menubar} view={view} />
        </Floater>
        <div className="post-editor">{editor}</div>
      </div>
    )
  }

  renderPost() {
    const {
      post,
      error,
      errorAt,
      isLoading,
      isEditable,
      lastSavedAt,
      lastUnsavedChangeAt,
    } = this.state
    const { body, title } = post.data.attributes
    const isNewPost = getIsNewPost(post)
    const lastSavedAtDate = new Date(lastSavedAt) // convert to date object
    const hasUnsavedChanges = lastSavedAtDate < lastUnsavedChangeAt

    options.doc = this.parse(body) // TODO: don't mutate "options"
    options.doc.comments = { comments: post.data.attributes.body_comments }

    var titleOptions = Object.assign({}, options)
    titleOptions.doc = this.parse(title)
    titleOptions.doc.comments = {
      comments: post.data.attributes.title_comments,
    }
    // titleOptions.comments = { comments: post.data.attributes.comments }

    return (
      <div>
        <PostMasthead post={post} />

        {error ? (
          <p className="post__error">
            <strong>{errorAt}</strong>: {error}
          </p>
        ) : null}

        <Editor
          post={post}
          options={titleOptions}
          onChange={this.handleChange}
          isEditable={isEditable}
          render={this.renderTitleEditor}
          field="title"
        />

        <Editor
          post={post}
          options={options}
          onChange={this.handleChange}
          isEditable={isEditable}
          render={this.renderBodyEditor}
          field="body"
          autoFocus
        />

        {isEditable && (
          <ChangesIndicator
            isLoading={isLoading}
            hasUnsavedChanges={hasUnsavedChanges}
            isNewPost={isNewPost}
            lastSavedAtDate={lastSavedAtDate}
          />
        )}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.state.isProcessing ? (
          <PostProcessingPlaceholder />
        ) : (
          this.renderPost()
        )}
      </div>
    )
  }
}

export default PostEditor
