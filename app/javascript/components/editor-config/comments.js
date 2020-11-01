// https://github.com/ProseMirror/website/blob/master/src/collab/client/comment.js
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { CommentForm } from '../CommentForm'
import { CommentContainer } from '../CommentContainer'
import { store } from '../../store'

import ReactDOM from 'react-dom'
import React from 'react'
import { saRequest } from '../../utils/saRequest'
// import { v4 as uuidv4 } from 'uuid'

export const commentPluginKey = new PluginKey('comments')

class Comment {
  constructor(text, id, user, highlightedText) {
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
    let base = this
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
      deco(c.from, c.to, new Comment(c.text, c.id, c.user))
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
  var url = '/add_comment'
  var { currentUser, currentPost } = store.getState()

  // currentUser = {
  //   data: {
  //     attributes: {
  //       name: "Anonymous",
  //       avatar_url: User.default_avatar_url
  //     }
  //   }
  // }

  var data = {
    comment: {
      data_to: action.to,
      data_from: action.from,
      data_key: comment.id,
      text: comment.text,
      field_type: field,
    },
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
      console.log({ res, err }) // DEBUG SAVE
    })
}

function randomID() {
  return Math.floor(Math.random() * 0xffffffff)
}

// Command for adding an annotation; it can be connected to the menu option for comments
export const addAnnotation = function (state, dispatch) {
  let sel = state.selection
  let highlightedText = state.doc.textBetween(sel.from, sel.to)

  if (sel.empty) return false
  console.log('dispatch', dispatch)
  if (dispatch) {
    const root =
      document.querySelector('#comment-modal') || document.createElement('div')
    root.id = '#comment-modal'
    document.body.appendChild(root)

    const handleClose = () => ReactDOM.unmountComponentAtNode(root)

    const handleNewComment = (payload, comment) => {
      const text = payload.text
      const user = buildUser()
      const newComment = new Comment(text, randomID(), user)

      dispatch(
        state.tr.setMeta(commentPlugin, {
          type: 'newComment',
          from: sel.from,
          to: sel.to,
          comment: newComment,
        })
      )

      handleClose()
    }

    const text = () => {
      return highlightedText
    }

    var thread = false
    let sel = state.selection
    let comments = commentPlugin.getState(state).commentsAt(sel.from)

    if (!comments.length) thread = true

    ReactDOM.render(
      <div>
        <ul className="commentList">
          <div className="j-replyContainer">
            <div className="reply-box pt-2 pl-3 pr-3">
              <CommentForm
                text={text()}
                thread={thread}
                onSubmit={handleNewComment}
                onCancel={handleClose}
                className="j-commentForm j-commentReplyForm mt-3 px-3 pt-3 animated"
              />
            </div>
          </div>
        </ul>
      </div>,
      root
    )
  }
  return true
}

export const annotationIcon = {
  width: 1024,
  height: 1024,
  path:
    'M512 219q-116 0-218 39t-161 107-59 145q0 64 40 122t115 100l49 28-15 54q-13 52-40 98 86-36 157-97l24-21 32 3q39 4 74 4 116 0 218-39t161-107 59-145-59-145-161-107-218-39zM1024 512q0 99-68 183t-186 133-257 48q-40 0-82-4-113 100-262 138-28 8-65 12h-2q-8 0-15-6t-9-15v-0q-1-2-0-6t1-5 2-5l3-5t4-4 4-5q4-4 17-19t19-21 17-22 18-29 15-33 14-43q-89-50-141-125t-51-160q0-99 68-183t186-133 257-48 257 48 186 133 68 183z',
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

function buildUser() {
  const { currentUser } = store.getState()
  return {
    id: currentUser.currentUser.id || '',
    avatar: currentUser.currentUser.attributes.avatar_url,
    username: currentUser.currentUser.attributes.username,
  }
}

function renderComments(comments, dispatch, state) {
  const node = document.createElement('div')
  // const node = document.getElementById('comment-container')
  node.className = 'tooltip-wrapper animated fadeIn'

  const handleDelete = (comment) => {
    dispatch(
      state.tr.setMeta(commentPlugin, { type: 'deleteComment', comment })
    )
  }

  const handleReplySubmit = (payload, comment) => {
    const text = payload.text
    const replyTo = commentPluginKey.getState(state).findComment(comment.id)
    const user = buildUser()

    dispatch(
      state.tr.setMeta(commentPlugin, {
        type: 'newComment',
        from: replyTo.from,
        to: replyTo.to,
        comment: new Comment(text, randomID(), user, highlightedText),
      })
    )
  }

  const highlightedText = () => {
    let sel = comments[0]
    return state.doc.textBetween(sel.from, sel.to)
  }

  ReactDOM.render(
    <CommentContainer
      comments={comments}
      onSubmit={handleReplySubmit}
      onDelete={handleDelete}
      currentUser={buildUser()}
      highlightedText={highlightedText()}
    />,
    node
  )
  return node
}
