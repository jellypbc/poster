import React, { useState, useEffect } from 'react'
// import { createConsumer } from '@rails/actioncable'
import { saRequest } from '../utils/saRequest'
import debounce from 'lodash/debounce'
// import sanitizeHtml from 'sanitize-html'

import { store } from '../store'
import { Editor } from './Editor'
import { Floater } from './Floater'
import { MenuBar } from './MenuBar'
import { PostMasthead } from './PostMasthead'
import { Sidebar } from './Sidebar'
import { Citations } from './Citations'
import { Backlinks } from './Backlinks'
import { ChangesIndicator } from './ChangesIndicator'
import { PostProcessingPlaceholder } from './PostProcessingPlaceholder'
import {
  bodyOptions as options,
  titleOptions,
  menu,
  titleMenu,
  annotationMenu,
} from './editor-config/index'

import { setCurrentUser } from '../features/userSlice'
import { setCurrentPost } from '../features/postsSlice'

import { commentPluginKey } from './editor-config/comments'
import { citationPluginKey } from './editor-config/citations'

import {
  getTimestamp,
  getIsNewPost,
  createParser,
  createSerializer,
} from '../utils/postUtils'

import type {
  IPost,
  ICurrentUser,
  IBacklink,
  ICitation
} from './types'

interface Props {
  post: IPost
  currentUser: ICurrentUser
  editable: boolean
  isProcessing: boolean
  backlinks: Array<IBacklink>
  citations: Array<ICitation>
}

export const PostEditor: React.FC<Props> = (props) => {
  console.log('POSTEDITOR PROPS', props)

  const {
    post,
    currentUser: user,
    isProcessing = false,
    editable: isEditable = false
  } = props

  const title = post.data.attributes.title || 'Untitled'
  const hasChanges = false //editor has changes (actual onChange may be debounced)
  const [isLoading, setIsLoading] = useState<boolean>(false) // is sending request to server
  const [error, setError] = useState<Error | null>(null)
  const [errorAt, setErrorAt] = useState<string | null>(null)
  const lastSavedAt: string | null = getTimestamp('updated_at', post)
  const [lastUnsavedChangeAt, setLastUnsavedChangeAt] = useState<string | null>(null) // Date string or null, used to track dirty state

  const state = {
    post,
    user,
    title,
    isLoading,
    hasChanges,
    error,
    errorAt,
    lastSavedAt,
    lastUnsavedChangeAt,
    isProcessing,
    isEditable,
  }

  const schema = options.schema
  const parse = createParser(schema)
  const serialize = createSerializer(schema)

  // const updateURL = () => {
  //   let title = sanitizeHtml(post.data.attributes.title, {
  //     allowedTags: [],
  //     allowedAttributes: {},
  //   })

  //   if (window.history.replaceState) {
  //     // Accounts for when there is no title for document
  //     document.title = title == null ? title : 'Untitled | Jelly'

  //     window.history.replaceState({}, title, post.data.attributes.slug)
  //   }
  // }

  useEffect(() => {
    // const postId = document.getElementById('post').getAttribute('data-post-id')
    // const cableHost = post.data.attributes.cable_url
    // const cable = createConsumer(cableHost)

    // cable.subscriptions.create(
    //   { channel: 'PostsChannel', post_id: postId },
    //   {
    //     connected() {},

    //     received: function (data) {
    //       setPost(data)
    //       setIsProcessing(false)
    //       updateURL()
    //     },
    //   }
    // )

    store.dispatch(setCurrentPost(post))

    if (user) {
      store.dispatch(setCurrentUser(user))
    }

    removeStaticRenderPlaceholder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeStaticRenderPlaceholder = () => {
    const placeholder = document.getElementsByClassName('placeholder-content')[0]
    if (placeholder) placeholder.remove()
  }

  // Debounces change handler so user has to stop typing to save,
  // but also adds maxWait so that if they type continuously, changes will
  // still be saved every so often.
  const debounceChanges = debounce(
    (doc, docState, onChange, field) => {
      onChange(serialize(doc), docState, field)
    },
    550,
    { maxWait: 4000 }
  )

  const handleChange = (doc, docState, field) => {
    debounceChanges(doc, docState, updatePost, field)
  }

  const updatePost = (doc, docState, field) => {
    setIsLoading(true)
    const { post } = state
    const isNewPost = getIsNewPost(post)
    const comments = JSON.stringify(
      commentPluginKey.getState(docState).allComments()
    )

    const citations =
      field !== 'title'
        ? JSON.stringify(citationPluginKey.getState(docState).allCitations())
        : ''

    const url = isNewPost ? '/posts' : post.data.attributes.form_url
    const method = isNewPost ? 'post' : 'put'

    const data =
      field === 'title'
        ? { title: doc, comments: comments, author_id: user.data.id }
        : {
            body: doc,
            comments: comments,
            citations: citations,
            author_id: user.data.id,
          }

    submit(data, method, url, onSuccess)
  }

  const onSuccess = (err, res) => {
    console.log({ res, err })
    const now = new Date().toISOString()
    setIsLoading(false)
    setError(err ? err : null)
    setErrorAt(err ? err : null)
    setLastUnsavedChangeAt(err ? lastSavedAt : now)
    // updateURL()
  }

  const submit = (data, method, url, onSuccess) => {
    saRequest[method](url)
      .send(data)
      .set('accept', 'application/json')
      .end((err, res) => {
        onSuccess(err, res)
      })
  }

  const renderTitleEditor = ({ editor, view }) => {
    const menubar = isEditable ? titleMenu : annotationMenu
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

  const renderBodyEditor = ({ editor, view }) => {
    const menubar = isEditable ? menu : annotationMenu
    return (
      <div>
        <Floater view={view}>
          <MenuBar menu={menubar} view={view} />
        </Floater>
        <div className="post-editor">{editor}</div>
      </div>
    )
  }

  const citations = (included: typeof citations) => {
    const citationsList = included.filter((c) => c.type === 'citation')

    return [
      ...new Map(
        citationsList.map((citation) => [
          citation.attributes.generated_post_id,
          citation,
        ])
      ).values(),
    ]
  }

  const backlinks = (included: typeof backlinks) => {
    const backlinksList = included.filter((c) => c.type === 'backlink')

    return [
      ...new Map(
        backlinksList.map((backlink) => [
          backlink.attributes.generated_post_id,
          backlink,
        ])
      ).values(),
    ]
  }

  const renderPost = () => {
    const included = post.included
    const body = post.data.attributes.body
    const title = post.data.attributes.title
    const isNewPost = getIsNewPost(post)
    const lastSavedAtDate = new Date(lastSavedAt || '')
    const hasUnsavedChanges = lastUnsavedChangeAt != null ? lastSavedAtDate.toISOString() < lastUnsavedChangeAt : false

    options.doc = parse(body) // TODO: don't mutate "options"
    options.doc.comments = { comments: post.data.attributes.body_comments }
    options.doc.citations = { citations: post.data.attributes.body_citations }

    titleOptions.doc = parse(title)
    titleOptions.doc.comments = {
      comments: post.data.attributes.title_comments,
    }

    return (
      <div className="row">
        <div className="col-md-12 masthead">
          {error ? (
            <p className="post__error">
              <strong>{errorAt}</strong>: {error}
            </p>
          ) : null}
          {post.data.attributes.upload_url && (
            <a
              className="upload d-flex justify-content-center"
              target="blank"
              href={post.data.attributes.upload_url}
            >
              View PDF
            </a>
          )}
          <Editor
            post={post}
            options={titleOptions}
            onChange={handleChange}
            isEditable={isEditable}
            render={renderTitleEditor}
            field="title"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <PostMasthead post={post} />
        </div>

        <div className="col-md-2" id="sidebar">
          {post.data.attributes.body && (
            <Sidebar post={post} options={options} />
          )}
        </div>

        <div className="col-md-8 center-column">
          <Editor
            post={post}
            options={options}
            onChange={handleChange}
            isEditable={isEditable}
            render={renderBodyEditor}
            field="body"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          {included && (
            <div>
              <Citations citations={citations(included)} />
              <Backlinks backlinks={backlinks(included)} />
            </div>
          )}
        </div>

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

  return (
    <div>{isProcessing ? <PostProcessingPlaceholder /> : renderPost()}</div>
  )
}
