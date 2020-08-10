import ReactDOM from 'react-dom'
import React from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import superagent from 'superagent'
import PostLinkSearch from '../PostLinkSearch'
import PostLinkSearch2 from '../PostLinkSearch2'

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

    const handleSubmit = (payload) => {
      console.log('state from my child component', payload)
      const action = {
        type: 'newPostLink',
        from: sel.from,
        to: sel.to,
        generatedPostId: payload.id,
        highlightedText: highlightedText,
        post_id: payload.currentPostId,
        value: payload.value,
      }
      console.log('action', action)
      dispatch(state.tr.setMeta(postLinkPlugin, action))
    }

    ReactDOM.render(
      <PostLinkSearch
        onCancel={handleClose}
        onHandleSubmit={handleSubmit}
        view={view}
      />,
      // <PostLinkSearch2
      //   onCancel={handleClose}
      //   onHandleSubmit={handleSubmit}
      //   view={view}
      // />
      root
    )
  }
  return true
}

function deco(from, to, postLink) {
  return Decoration.inline(from, to, { class: 'link' }, postLink)
}

class PostLink {
  constructor(title, highlightedText) {
    this.title = title
    this.highlightedText = highlightedText
  }
}

class PostLinkState {
  constructor(decos) {
    this.decos = decos
  }

  apply(tr) {
    let action = tr.getMeta(postLinkPlugin),
      actionType = action && action.type
    let base = this
    let { decos } = base
    decos = decos.map(tr.mapping, tr.doc)

    if (actionType == 'newPostLink') {
      decos = decos.add(tr.doc, [deco(action.from, action.to)])
      submitCitationCreate(action)
    } else if (actionType == 'deletePostLink') {
      // decos = decos.remove([this.findPostLink(action.postLink.id)])
    }
    return new PostLinkState(decos)
  }

  static init(config) {
    const postLinks = config.doc.postlinks

    if (postLinks) {
      let decos = postLinks.postlinks.map((p) =>
        deco(p.from, p.to, new PostLink(p.title, p.highlightedText))
      )
      console.log('decos', decos)

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
      data_key: action.key,
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

export const postLinkPluginKey = new PluginKey('postlinks')

export const postLinkPlugin = new Plugin({
  key: postLinkPluginKey,
  state: {
    init: PostLinkState.init,
    apply(tr, prev) {
      // eslint-disable-next-line no-unused-expressions
      PostLinkState.init
      // console.log("oldState", oldState)
      return prev.apply(tr)
    },
  },
  props: {
    decorations(state) {
      console.log('this.getState(state)', state)
      console.log('this.getState(state)', postLinkPlugin.getState(state))
      return this.getState(state).decos
    },
  },
})

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
        return <div key={index}>{p.type.spec.highlightedText}</div>
      })}
    </ul>,
    node
  )
  return node
}
