import ReactDOM from 'react-dom'
import React from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

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
    const handleSubmit = () => {}

    ReactDOM.render(
      <PostLinkSearch belly={handleClose} denny={handleSubmit} view={view} />,
      root
    )
  }
  return true
}

export const postlinkPluginKey = new PluginKey('postlink')

export const postlinkPlugin = new Plugin({
  key: postlinkPluginKey,
  state: {
    init: {},
    apply(tr, prev) { return prev.apply(tr) }
  },
  props: {
    decorations(state) { return this.getState(state).decos }
  }

})

export const postlinkUI = function(dispatch) {
  return new Plugin({
    props: {
      decorations(state) {
        return postlinkTooltip(state, dispatch)
      }
    }
  })
}

function postlinkTooltip(state, dispatch) {
  let sel = state.selection
  if (!sel.empty) return null
  console.log('state', state)
  let links = postlinkPlugin.getState(state).linksAt(sel.from)
  if (!links.length) return null
  return DecorationSet.create(state.doc, [Decoration.widget(sel.from, renderLinks(links, dispatch, state))])
}

function renderLinks(links, dispatch, state) {
  return crel("div", {class: "tooltip-wrapper"},
              crel("ul", {class: "commentList"},
                   links.map(c => renderLink(c.spec.link, dispatch, state))))
}

function renderLink(link, dispatch, state) {
  let btn = crel("button", {class: "linkDelete", title: "Delete annotation"}, "×")
  btn.addEventListener("click", () =>
    dispatch(state.tr.setMeta(postlinkPlugin, {type: "deletelink", link}))
  )
  return crel("li", {class: "linkText"}, link.text, btn)
}


class PostlinkState {
  constructor(version, decos, unsent, field) {
    this.version = version
    this.decos = decos
    this.unsent = unsent
    this.field = field
  }

  findLink(id) {
    let current = this.decos.find()
    for (let i = 0; i < current.length; i++)
      if (current[i].spec.comment.id == id) return current[i]
  }

  linksAt(pos) {
    return this.decos.find(pos, pos)
  }

  apply(tr) {
    // let action = tr.getMeta(commentPlugin),
    //   actionType = action && action.type
    // if (!action && !tr.docChanged) return this
    // let base = this
    // let { decos, unsent, field } = base
    // decos = decos.map(tr.mapping, tr.doc)

    // if (actionType == 'newComment') {
    //   decos = decos.add(tr.doc, [deco(action.from, action.to, action.comment)])
    //   unsent = unsent.concat(action)
    //   submitCreateComment(action, action.comment, field)
    // } else if (actionType == 'deleteComment') {
    //   decos = decos.remove([this.findLink(action.comment.id)])
    //   unsent = unsent.concat(action)
    //   submitDeleteComment(action.comment)
    // }
    // return new PostlinkState(base.version, decos, unsent, field)
  }

  static init(config) {
    const existingComments = config.doc.comments.comments || []

    let decos = existingComments.map((c) =>
      deco(c.from, c.to, new Postlink(c.text, c.id, c.user))
    )

    return new PostlinkState(
      config.version,
      [],
      [],
      config.field
    )
    // return new PostlinkState(
    //   config.version,
    //   DecorationSet.create(config.doc, decos),
    //   [],
    //   config.field
    // )
  }
}

class Postlink {
  constructor(text, id, user) {
    this.id = id
    this.text = text
    this.user = user
  }
}
