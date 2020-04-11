// https://github.com/ProseMirror/website/blob/master/src/collab/client/comment.js
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import CommentForm from '../CommentForm'
import ReactDOM from 'react-dom'
import React from 'react'
import classnames from 'classnames'

export const pluginKey = new PluginKey('comments')

class Comment {
  constructor(text, id) {
    this.id = id
    this.text = text
  }
}

function deco(from, to, comment) {
  return Decoration.inline(from, to, { class: 'comment' }, { comment })
}

class CommentState {
  constructor(version, decos, unsent) {
    this.version = version
    this.decos = decos
    this.unsent = unsent
  }

  findComment(id) {
    let current = this.decos.find()
    for (let i = 0; i < current.length; i++)
      if (current[i].spec.comment.id == id) return current[i]
  }

  commentsAt(pos) {
    return this.decos.find(pos, pos)
  }

  apply(tr) {
    let action = tr.getMeta(commentPlugin),
      actionType = action && action.type
    if (!action && !tr.docChanged) return this
    let base = this
    let { decos, unsent } = base
    decos = decos.map(tr.mapping, tr.doc)
    if (actionType == 'newComment') {
      decos = decos.add(tr.doc, [deco(action.from, action.to, action.comment)])
      unsent = unsent.concat(action)
    } else if (actionType == 'deleteComment') {
      decos = decos.remove([this.findComment(action.comment.id)])
      // debugger;
      unsent = unsent.concat(action)
    }
    return new CommentState(base.version, decos, unsent)
  }

  static init(config) {
    console.log('init', config)
    const existingComments =
      (config.doc.comments
        ? config.doc.comments.comments
        : config.comments.comments) || []
    let decos = existingComments.map((c) =>
      deco(c.from, c.to, new Comment(c.text, c.id))
    )
    return new CommentState(
      config.comments.version,
      DecorationSet.create(config.doc, decos),
      []
    )
  }
}

export function serialize(action) {
  console.log('i am a comment', action)
  return {
    to: action.to,
    from: action.from,
    id: action.comment.id,
    text: action.comment.text,
  }
}

export const commentPlugin = new Plugin({
  key: pluginKey,
  state: {
    init: CommentState.init,
    apply(tr, prev) {
      return prev.apply(tr)
    },
  },
  props: {
    decorations(state) {
      return this.getState(state).decos
    },
  },
})

function randomID() {
  return Math.floor(Math.random() * 0xffffffff)
}

// Command for adding an annotation; it can be connected to the menu option for comments

export const addAnnotation = function (state, dispatch) {
  let sel = state.selection
  if (sel.empty) return false
  if (dispatch) {
    const root =
      document.querySelector('#comment-modal') || document.createElement('div')
    root.id = '#comment-modal'
    document.body.appendChild(root)

    const handleClose = () => ReactDOM.unmountComponentAtNode(root)

    const handleNewComment = ({ text }) => {
      dispatch(
        state.tr.setMeta(commentPlugin, {
          type: 'newComment',
          from: sel.from,
          to: sel.to,
          comment: new Comment(text, randomID()),
        })
      )
      // side effect to scroll window to here
      // store.dispatch(dosideeffect)
      handleClose()
    }

    ReactDOM.render(
      <CommentForm
        onSubmit={handleNewComment}
        onCancel={handleClose}
        className="j-commentForm shadow rounded"
      />,
      root
    )
  }
  return true // TODO: what is the return value used for?
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
  node.className = 'tooltip-wrapper'
  ReactDOM.render(
    <ul className="commentList py-2">
      {comments.map((c, index) => {
        const isLast = index === comments.length - 1
        return (
          <ThreadedComment
            key={index}
            comment={c.spec.comment}
            dispatch={dispatch}
            state={state}
            className={classnames('px-3 py-1', { 'border-bottom': !isLast })}
            showActions={{ reply: isLast, delete: true }}
          />
        )
      })}
    </ul>,
    node
  )
  return node
}

function ThreadedComment(props) {
  const { comment, dispatch, state, className, showActions } = props
  const [isShowingReply, setIsShowingReply] = React.useState(false)

  const handleDelete = () => {
    dispatch(
      state.tr.setMeta(commentPlugin, { type: 'deleteComment', comment })
    )
  }

  const handleReply = () => {
    setIsShowingReply(true)
  }

  const handleReplySubmit = ({ text = 'Comment...' }) => {
    const replyTo = pluginKey.getState(state).findComment(comment.id)
    dispatch(
      state.tr.setMeta(commentPlugin, {
        type: 'newComment',
        from: replyTo.from,
        to: replyTo.to,
        comment: new Comment(text, randomID()),
      })
    )
  }

  const handleReplyCancel = () => {
    setIsShowingReply(false)
  }

  return (
    <div className={classnames('comment-show', className)}>
      <p className="j-commentText">{comment.text}</p>
      {!isShowingReply && (
        <>
          {showActions.reply && (
            <button
              className="btn btn-plain btn-sm j-commentReply px-0 mr-2"
              onClick={handleReply}
            >
              Reply
            </button>
          )}
          {showActions.delete && (
            <button
              className="btn btn-plain btn-sm j-commentDelete px-0 mr-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </>
      )}
      {isShowingReply && (
        <>
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={handleReplyCancel}
            className="j-commentReplyForm border-top mt-3 pt-1"
          />
        </>
      )}
    </div>
  )
}
