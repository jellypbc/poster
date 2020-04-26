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

import {
  pluginKey as commentPluginKey,
  serialize as serializeComment,
} from './editor-config/plugin-comment'

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

  // Remove the static placeholder content once component renders
  removeStaticRenderPlaceholder = () => {
    var placeholder = document.getElementsByClassName('placeholder-content')[0]
    placeholder.remove()
  }

  handleTitleChange = (doc, docState) => {
    this.debounceTitleChanges(doc, docState)
  }

  debounceTitleChanges = debounce(
    (doc, docState) => {
      const onChange = this.updateTitle
      onChange(this.serialize(doc), docState)
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

  updateTitle = (doc, docState) => {
    // do not read from this.state after setState, it will not update until rerender
    this.setState({ isLoading: true })
    var { post } = this.state
    const isNewPost = getIsNewPost(post)
    var url = isNewPost ? '/posts' : post.data.attributes.form_url
    var title = doc

    var data = { title: title }
    var method = isNewPost ? 'post' : 'put'
    var token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    superagent[method](url)
      .send(data)
      .set('X-CSRF-Token', token)
      .set('accept', 'application/json')
      .end((err, res) => {
        // use the browser timestamp instead of new updated_at
        const now = new Date().toISOString()
        this.setState((state) => ({
          post: res.body.post,
          isLoading: false,
          error: err ? err : null,
          errorAt: err ? now : null,
          lastSavedAt: err ? state.lastSavedAt : now,
        }))
        this.updateURL() // refresh the window history
      })
  }

  handleChange = (doc, docState) => {
    // Tell the parent component there are changes ("dirty state")
    // and also call debounced full change handler.
    this.setState({ lastUnsavedChangeAt: new Date() })
    this.debounceChanges(doc, docState) // this is debounced to save bandwidth
  }

  // Debounces change handler so user has to stop typing to save,
  // but also adds maxWait so that if they type continuously, changes will
  // still be saved every so often.
  //
  // TODO: Move debouncing into updatePost()
  debounceChanges = debounce(
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

    console.log('>>>>>>>>>>> update')
    const commentState = commentPluginKey.getState(docState)
    console.log('commentState', commentState)

    const newCommentsToSave = commentState.unsent
      .filter((action) => action.type === 'newComment')
      .map(serializeComment)

    // console.log('newCommentsToSave', newCommentsToSave)

    // TODO: serialize JSON on server instead of parsing string?
    const oldPluginState = post.data.attributes.comments

    // console.log('oldPluginState', oldPluginState)

    const comments = [...(oldPluginState || []), ...newCommentsToSave].filter(
      (comment) => {
        return !commentState.unsent.find((action) => {
          const isDeletable = action.type === 'deleteComment'
          const isTheComment = action.comment.id === comment.id
          return isDeletable && isTheComment
        })
      }
    )
    let decos = commentState.decos.map((c) => c)
    console.log('decos?', decos)

    // console.log('commentState', commentState)

    // var allComments = commentState.decos.

    var url = isNewPost ? '/posts' : post.data.attributes.form_url
    var data = {
      body: doc,
      comments: comments,
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
        const now = new Date().toISOString()
        this.setState((state) => ({
          isLoading: false,
          error: err ? err : null,
          errorAt: err ? now : null,
          lastSavedAt: err ? state.lastSavedAt : now,
        }))
      })
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
    const isNewPost = getIsNewPost(post)
    const postBody = post.data.attributes.body
    const lastSavedAtDate = new Date(lastSavedAt) // convert to date object
    const hasUnsavedChanges = lastSavedAtDate < lastUnsavedChangeAt

    options.doc = this.parse(postBody) // TODO: don't mutate "options"
    options.doc.comments = { comments: post.data.attributes.comments }

    const postTitle = post.data.attributes.title
    var titleOptions = Object.assign({}, options)
    titleOptions.doc = this.parse(postTitle)

    var menubar = isEditable ? menu : annotationMenu

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
          onChange={this.handleTitleChange}
          isEditable={isEditable}
          render={({ editor, view }) => (
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
          )}
        />

        <Editor
          post={post}
          autoFocus
          options={options}
          onChange={this.handleChange}
          isEditable={isEditable}
          render={({ editor, view }) => (
            <div>
              <Floater view={view}>
                <MenuBar menu={menubar} view={view} />
              </Floater>
              <div className="post-editor">{editor}</div>
            </div>
          )}
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
