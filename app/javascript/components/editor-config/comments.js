// https://github.com/ProseMirror/website/blob/master/src/collab/client/comment.js
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { CommentForm } from '../CommentForm'
import { store } from '../../store'

import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { saRequest } from '../../utils/saRequest'
import classnames from 'classnames'

export const commentPluginKey = new PluginKey('comments')

class Comment {
  constructor(id, text, user, highlightedText) {
    this.id = id
    this.text = text
    this.user = user
    this.highlightedText = highlightedText
  }
}

function deco(from, to, comment) {
  return Decoration.inline(from, to, { class: 'comment' }, { comment })
}

class CommentState {
  constructor(version, decos, unsent, field) {
    this.version = version
    this.decos = decos
    this.unsent = unsent
    this.field = field
  }

  findComment(id) {
    let current = this.decos.find()
    for (let i = 0; i < current.length; i++)
      if (current[i].spec.comment.id == id) return current[i]
  }

  commentsAt(pos) {
    return this.decos.find(pos, pos)
  }

  allComments() {
    let { decos } = this
    const comments = decos.find().map((comment) => {
      return {
        to: comment.to,
        from: comment.from,
        id: comment.type.spec.comment.id,
        text: comment.type.spec.comment.text,
      }
    })
    return comments
  }

  apply(tr) {
    let action = tr.getMeta(commentPlugin),
      actionType = action && action.type
    if (!action && !tr.docChanged) return this
    let base
    base = this
    let { decos, unsent, field } = base
    decos = decos.map(tr.mapping, tr.doc)

    if (actionType == 'newComment') {
      decos = decos.add(tr.doc, [deco(action.from, action.to, action.comment)])
      unsent = unsent.concat(action)
      submitCreateComment(action, action.comment, field)
    } else if (actionType == 'deleteComment') {
      decos = decos.remove([this.findComment(action.comment.id)])
      unsent = unsent.concat(action)
      submitDeleteComment(action.comment)
    }
    return new CommentState(base.version, decos, unsent, field)
  }

  static init(config) {
    const existingComments = config.doc.comments.comments || []

    let decos = existingComments.map((c) =>
      deco(c.from, c.to, new Comment(c.id, c.text, c.user, c.highlightedText))
    )

    return new CommentState(
      config.version,
      DecorationSet.create(config.doc, decos),
      [],
      config.field
    )
  }
}

export function serialize(action) {
  return {
    to: action.to,
    from: action.from,
    id: action.comment.id,
    text: action.comment.text,
  }
}

export const commentPlugin = new Plugin({
  key: commentPluginKey,
  state: {
    init: CommentState.init,
    apply(tr, prev) {
      CommentState.init // eslint-disable-line no-unused-expressions
      return prev.apply(tr)
    },
  },
  props: {
    decorations(state) {
      return this.getState(state).decos
    },
    // handlePaste: function(){
    //   console.log("pasting")
    // },
    //   console.log(event)
    // },
    // handleDOMEvents: function (view, event) {
    //   console.log("PLUGIN eve", event)
    //   return true
    // }
  },
})

function randomID() {
  return Math.floor(Math.random() * 0xffffffff)
}

function submitDeleteComment(comment) {
  var data = {
    comment: {
      data_key: comment.id,
      deleted_at: true,
    },
  }
  var url = '/remove_comment'
  submitRequest(data, url)
}

function submitCreateComment(action, comment, field) {
  const url = '/add_comment'
  const { currentUser, currentPost } = store.getState()

  let data = {
    comment: {
      data_to: action.to,
      data_from: action.from,
      data_key: comment.id,
      text: comment.text,
      field_type: field,
      highlighted_text: comment.highlightedText,
    }
  }

  if (currentPost) {
    data.comment.post_id = currentPost.currentPost.id
  }

  if (currentUser && currentUser.currentUser) {
    data.comment.user_id = currentUser.currentUser.id
  }

  submitRequest(data, url)
}

function submitRequest(data, url) {
  saRequest
    .post(url)
    .send(data)
    .set('accept', 'application/json')
    .end((err, res) => {
      console.log({ res, err }) 
    })
}

// Command for adding an annotation; it can be connected to the menu option for comments
export const addComment = function (state, dispatch) {
  let sel = state.selection
  if (sel.empty) return false
  let highlightedText = state.doc.textBetween(sel.from, sel.to)
  if (dispatch) {
    const root =
      document.querySelector('#comment-modal') || 
      document.createElement('div')
    root.id = '#comment-modal'
    document.body.appendChild(root)

    const handleClose = () => ReactDOM.unmountComponentAtNode(root)

    const handleNewComment = ({ text }) => {
      const user = buildUser()
      const newComment = new Comment(randomID(), text, user, highlightedText)

      const action = {
        type: 'newComment',
        from: sel.from,
        to: sel.to,
        comment: newComment,
      }

      dispatch(state.tr.setMeta(commentPlugin, action))

      handleClose()
    }

    var thread = false
    let sel = state.selection
    let comments = commentPlugin.getState(state).commentsAt(sel.from)

    if (!comments.length) thread = true

    ReactDOM.render(
      <CommentForm
        thread={thread}
        onSubmit={handleNewComment}
        onCancel={handleClose}
        className="j-commentForm shadow rounded"
      />,
      root
    )
  }
  return true
}
// Comment UI

export const commentUI = function (transaction) {
  return new Plugin({
    props: {
      decorations(state) {
        return commentTooltip(state, transaction)
      },
    },
    // handlePaste: function(){
    //   console.log("pasting")
    // },
    // handleKeyDown: function(view, e){
    //   console.log(event)
    // },
    // handleDOMEvents: function (view, event) {
    //   console.log("PLUGIN eve", event)
    //   return true
    // }
  })
}

function commentTooltip(state, dispatch) {
  let sel = state.selection
  if (!sel.empty) return null
  let comments = commentPlugin.getState(state).commentsAt(sel.from)
  if (!comments.length) return null
  return DecorationSet.create(state.doc, [
    Decoration.widget(sel.from, renderComments(comments, dispatch, state)),
  ])
}

function renderComments(comments, dispatch, state) {
  const node = document.createElement('div')
  // const node = document.getElementById('comment-container')
  node.className = 'tooltip-wrapper animated fadeIn'
  ReactDOM.render(
    <ul className="commentList">
      {comments.map((c, index) => {
        const isLast = index === comments.length - 1
        return (
          <ThreadedComment
            key={index}
            comment={c.spec.comment}
            dispatch={dispatch}
            state={state}
            className={classnames('px-3 ', { 'border-bottom': !isLast })}
            showActions={{ reply: isLast, delete: true }}
          />
        )
      })}
    </ul>,
    node
  )
  return node
}

function buildUser() {
  const { currentUser } = store.getState()
  return {
    id: currentUser.currentUser.id || '',
    avatar: currentUser.currentUser.attributes.avatar_url,
    username: currentUser.currentUser.attributes.username,
  }
}

function ThreadedComment(props) {
  const { comment, dispatch, state, className, showActions } = props
  const [isShowingReply, setIsShowingReply] = useState(false)

  const handleDelete = () => {
    dispatch(
      state.tr.setMeta(commentPlugin, { type: 'deleteComment', comment })
    )
  }

  const handleReply = () => {
    setIsShowingReply(true)
  }

  const handleReplySubmit = ({ text = 'Comment...', highlightedText = '' }) => {
    const replyTo = commentPluginKey.getState(state).findComment(comment.id)
    const user = buildUser()

    dispatch(
      state.tr.setMeta(commentPlugin, {
        type: 'newComment',
        from: replyTo.from,
        to: replyTo.to,
        comment: new Comment(randomID(), text, user, highlightedText),
      })
    )
  }

  const handleReplyCancel = () => {
    setIsShowingReply(false)
  }

  const { currentUser } = store.getState()

  return (
    <div
      className={classnames('commentShow', className)}
      id={'comment-' + comment.id}
    >
      {comment.user && (
        <div className="j-commentUser">
          <a
            className="name-card"
            href={comment.user.username ? '/@' + comment.user.username : '#'}
            target="blank"
          >
            <img
              className="avatar"
              src={comment.user.avatar}
              alt={comment.user.username}
            />
            {comment.user.username}
          </a>
        </div>
      )}
      <p className="j-commentText">{comment.text}</p>
      {!isShowingReply && (
        <div>
          {showActions.reply && (
            <button
              className="btn btn-plain btn-sm j-commentReply px-0 mr-2"
              onClick={handleReply}
            >
              Reply
            </button>
          )}
          {showActions.delete &&
            currentUser &&
            currentUser.currentUser &&
            currentUser.currentUser.id == comment.user.id && (
              <button
                className="btn btn-plain btn-sm j-commentDelete px-0 mr-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
        </div>
      )}
      {isShowingReply && (
        <div>
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={handleReplyCancel}
            className="j-commentReplyForm border-top mt-3 pt-1 animated fadeIn"
          />
        </div>
      )}
    </div>
  )
}
