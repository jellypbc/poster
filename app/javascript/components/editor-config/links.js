import ReactDOM from 'react-dom'
import React from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import superagent from 'superagent'


import PostLinkSearch from '../PostLinkSearch'

export const addPostLink = function (state, dispatch, view) {
  let sel = state.selection
  if (sel && sel.empty) return false
  if (dispatch) {
    const root =
      document.querySelector('#link-search-modal') || document.createElement('div')
    root.id = '#link-search-modal'
    document.body.appendChild(root)

    const handleClose = () => ReactDOM.unmountComponentAtNode(root)

    const handleSubmit = (payload) => {
      console.log('state from my child component', payload)
      console.log('state from my child component', payload.currentPostId)
      const action = {
        type: 'newPostLink',
        from: sel.from,
        to: sel.to,
        generated_post_id: payload.id,
        post_id: payload.currentPostId,
        value: payload.value
      }
      console.log("action", action)
      dispatch(
        state.tr.setMeta(postLinkPlugin, action)
      )

    }

    ReactDOM.render(
      <PostLinkSearch
        belly={handleClose}
        parentHandleSubmit={handleSubmit}
        view={view}
      />,
      root
    )
  }
  return true
}

function deco(from, to) {
  return Decoration.inline(from, to, { class: 'link' })
}

class PostLinkState {
  constructor(decos){
    this.decos = decos
  }

  apply(tr) {
    let action = tr.getMeta(postLinkPlugin)

    if (action && action.type == "newPostLink") {
      console.log('action', action)
      submitCitationCreate(action)
    }

    let base = this
    let { decos } = base
    decos = decos.map(tr.mapping, tr.doc)

    return new PostLinkState(decos)
  }

  static init(config) {
    const postlinks = config.doc.postlinks

    if (postlinks) {

      console.log('postlinks', postlinks.postlinks)

      let decos = postlinks.postlinks.map((c) =>
        deco(c.from, c.to)
      )

      const d = DecorationSet.create(config.doc, decos)
      return new PostLinkState(d)
    } else {
      return new PostLinkState(DecorationSet.create(config.doc, []))
    }
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
      generated_post_id: action.generated_post_id,
      title: action.value,
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
      PostLinkState.init
      // console.log("oldState", oldState)
      return prev.apply(tr)
    }
  },
  props: {
    decorations(state) {
      console.log('this.getState(state)', state)
      console.log('this.getState(state)', postLinkPlugin.getState(state))
      return this.getState(state).decos
    }
  }
})


export const specklePlugin = new Plugin({
  state: {
    init(_, { doc }) {
      let speckles = []
      for (let pos = 1; pos < doc.content.size; pos += 4)
        speckles.push(Decoration.inline(pos - 1, pos, {style: "background: yellow"}))
      return DecorationSet.create(doc, speckles)
    },
    apply(tr, set) { return set.map(tr.mapping, tr.doc) }
  },
  props: {
    decorations(state) { return specklePlugin.getState(state) }
  }
})



