/* eslint-disable no-unused-expressions */
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import PostLinkSearch from '../PostLinkSearch'

import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import superagent from 'superagent'
import classnames from 'classnames'

// Assigning a key does mean only one plugin of that type (of type 'postlinks') can be active in a state.
export const postLinkPluginKey = new PluginKey('postlinks')

// this creates a new post link object?
class PostLink {
  constructor(id, title, highlightedText, url) {
    this.id = id
    this.title = title
    this.highlightedText = highlightedText
    this.url = url
  }
}

function deco(from, to, postLink) {
  return Decoration.inline(from, to, { class: 'link' }, postLink)
}

class PostLinkState {
  constructor(decos) {
    this.decos = decos
  }

  findPostLink(id) {
    let current = this.decos.find()
    console.log('current.length', current.length)
    for (let i = 0; i < current.length; i++)
      if (current[i].type.spec.id == id) return current[i]
  }

  apply(tr) {
    let action = tr.getMeta(postLinkPlugin),
      actionType = action && action.type
    if (!action && !tr.docChanged) return this
    let base = this
    let { decos } = base
    decos = decos.map(tr.mapping, tr.doc)
    console.log('action', action)
    console.log('actionType', actionType)
    if (actionType == 'newPostLink') {
      decos = decos.add(tr.doc, [deco(action.from, action.to, action.postLink)])
      submitCitationCreate(action)
    } else if (actionType == 'deletePostLink') {
      decos = decos.remove([this.findPostLink(action.postLink.id)])
      submitCitationDelete(action)
    }
    return new PostLinkState(decos)
  }

  static init(config) {
    const postLinks = config.doc.postlinks

    if (postLinks) {
      let decos = postLinks.postlinks.map((p) =>
        deco(
          p.from,
          p.to,
          new PostLink(p.id, p.title, p.highlightedText, p.url)
        )
      )
      console.log('decos', decos[0])

      const d = DecorationSet.create(config.doc, decos)
      return new PostLinkState(d)
    } else {
      return new PostLinkState(DecorationSet.create(config.doc, []))
    }
  }

  postLinksAt(pos) {
    return this.decos.find(pos, pos)
  }
}

export const addPostLink = function (state, dispatch, view) {
  let sel = state.selection
  if (sel && sel.empty) return false
  let highlightedText = state.doc.textBetween(sel.from, sel.to)
  if (dispatch) {
    const root =
      document.querySelector('#link-search-modal') ||
      document.createElement('div')
    root.id = '#link-search-modal'
    document.body.appendChild(root)

    const handleClose = () => ReactDOM.unmountComponentAtNode(root)

    const handleNewPostLink = (payload) => {
      console.log('state from my child component', payload)
      // TODO: refactor this code
      if (payload.id !== '') {
        const action = {
          type: 'newPostLink',
          from: sel.from,
          to: sel.to,
          generatedPostId: payload.id,
          highlightedText: highlightedText,
          post_id: payload.currentPostId,
          value: payload.value,
          id: randomID(),
        }
        console.log('action', action)
        dispatch(state.tr.setMeta(postLinkPlugin, action))
      } else {
        const token = document.head.querySelector('[name~=csrf-token][content]')
          .content
        const data = { post: { title: payload.value } }
        const url = '/posts'

        let p = new Promise(function (resolve, reject) {
          superagent
            .post(url)
            .send(data)
            .set('X-CSRF-Token', token)
            .set('accept', 'application/json')
            .then((res) => {
              console.log('res', res.body.post.id)
              resolve(res)
            })
            .catch((err) => {
              console.log(err.message)
            })
        })
        p.then((result) => {
          const action = {
            type: 'newPostLink',
            from: sel.from,
            to: sel.to,
            generatedPostId: result.body.post.id,
            highlightedText: highlightedText,
            post_id: payload.currentPostId,
            value: payload.value,
            id: randomID(),
          }
          console.log('action', action)
          dispatch(state.tr.setMeta(postLinkPlugin, action))
        })
      }
      handleClose()
      // open up post link window
    }

    ReactDOM.render(
      <PostLinkSearch
        onCancel={handleClose}
        onHandleSubmit={handleNewPostLink}
        view={view}
      />,
      root
    )
  }
  return true
}

// function submitPostCreate(action) {
//   var url
//   var data

//   submitRequest(data, url)
// }

function submitCitationCreate(action) {
  console.log('submitCitationCreate', action)

  var url = '/add_citation'
  var data = {
    citation: {
      generated_post_id: action.generatedPostId,
      title: action.value,
      highlighted_text: action.highlightedText,
      post_id: action.post_id,
      data_to: action.to,
      data_from: action.from,
      data_key: action.id,
    },
  }

  submitRequest(data, url)
}

function submitCitationDelete(action) {
  console.log('submitCitationDelete', action)
  console.log('action.postLink.id', action.postLink.id)

  var url = '/remove_citation'
  var data = {
    citation: {
      data_key: action.postLink.id,
      deleted_at: true, // TODO: change true to timestamp
    },
  }
  submitRequest(data, url)
}

function submitRequest(data, url) {
  const token = document.head.querySelector('[name~=csrf-token][content]')
    .content

  superagent
    .post(url)
    .send(data)
    .set('X-CSRF-Token', token)
    .set('accept', 'application/json')
    .end((err, res) => {
      console.log({ res, err }) // DEBUG SAVE
    })
}

export const postLinkPlugin = new Plugin({
  key: postLinkPluginKey, // is the key = 'postlinks'?
  state: {
    init: PostLinkState.init,
    apply(tr, prev) {
      PostLinkState.init // eslint-disable-next-line no-unused-expressions
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

export const postLinkUI = function (transaction) {
  return new Plugin({
    props: {
      decorations(state) {
        return postLinkTooltip(state, transaction)
      },
    },
  })
}

function postLinkTooltip(state, dispatch) {
  let sel = state.selection
  if (!sel.empty) return null
  let postLinks = postLinkPlugin.getState(state).postLinksAt(sel.from)
  if (!postLinks.length) return null
  return DecorationSet.create(state.doc, [
    Decoration.widget(sel.from, renderPostLinks(postLinks, dispatch, state)),
  ])
}

function renderPostLinks(postLinks, dispatch, state) {
  console.log('postLinks', postLinks)
  const node = document.createElement('div')
  node.className = 'tooltip-wrapper animated fadeIn'
  ReactDOM.render(
    <ul className="commentList">
      {postLinks.map((p, index) => {
        console.log('p', p)
        console.log('index', index)
        const isLast = index === postLinks.length - 1
        return (
          <ThreadedPostLink
            key={index}
            postLink={p.type.spec}
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

function ThreadedPostLink(props) {
  const { postLink, dispatch, state, className, showActions } = props
  const [isShowingReply, setIsShowingReply] = useState(false)

  const highlightedText = {
    background: 'rgba(90,173,152,.4)',
    fontSize: '.5em',
    margin: '4px 0px',
  }

  const titleText = {
    fontSize: '.5em',
    color: 'black',
    lineHeight: '1',
  }

  const handleDelete = () => {
    dispatch(
      state.tr.setMeta(postLinkPlugin, { type: 'deletePostLink', postLink })
    )
  }

  const handleClose = () => {
    setIsShowingReply(false)
  }

  return (
    <div
      className={classnames('commentShow', className)}
      id={'comment-' + postLink.id}
    >
      <div style={highlightedText}> {postLink.highlightedText} </div>
      <div>
        {/* Fix the URL */}
        <a
          href={'http://localhost:3000/@cindy/' + postLink.url}
          target="_blank"
          style={titleText}
        >
          {postLink.title}
        </a>
      </div>
      <div>
        <button className="btn" onClick={handleDelete} style={titleText}>
          Delete
        </button>
      </div>
    </div>
  )
}
