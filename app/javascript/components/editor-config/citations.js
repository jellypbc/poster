/* eslint-disable no-unused-expressions */
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import CitationSearch from '../CitationSearch'

import ReactDOM from 'react-dom'
import React from 'react'
import superagent from 'superagent'
import classnames from 'classnames'
import { store } from '../store'

export const citationPluginKey = new PluginKey('citations')

class Citation {
  constructor(id, title, highlightedText, url) {
    this.id = id
    this.title = title
    this.highlightedText = highlightedText
    this.url = url
  }
}

function deco(from, to, citation) {
  return Decoration.inline(from, to, { class: 'citation' }, citation)
}

class CitationState {
  constructor(decos) {
    this.decos = decos
  }

  findCitation(id) {
    let current = this.decos.find()
    for (let i = 0; i < current.length; i++)
      if (current[i].type.spec.id == id) return current[i]
  }

  apply(tr) {
    let action = tr.getMeta(citationPlugin),
      actionType = action && action.type
    if (!action && !tr.docChanged) return this
    let base = this
    let { decos } = base
    decos = decos.map(tr.mapping, tr.doc)
    console.log('action', action)
    if (actionType == 'newCitation') {
      decos = decos.add(tr.doc, [deco(action.from, action.to, action.citation)])
      submitCitationCreate(action)
    } else if (actionType == 'deleteCitation') {
      decos = decos.remove([this.findCitation(action.citation.id)])
      submitCitationDelete(action)
    }
    return new CitationState(decos)
  }

  static init(config) {
    const citations = config.doc.citations

    if (citations) {
      let decos = citations.citations.map((p) =>
        deco(
          p.from,
          p.to,
          new Citation(p.id, p.title, p.highlightedText, p.url)
        )
      )
      const d = DecorationSet.create(config.doc, decos)
      return new CitationState(d)
    } else {
      return new CitationState(DecorationSet.create(config.doc, []))
    }
  }

  citationsAt(pos) {
    return this.decos.find(pos, pos)
  }
}

export const addCitation = function (state, dispatch, view) {
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

    const handleNewCitation = (payload) => {
      console.log('in handleNewCitation payload', payload)
      // TODO: refactor
      var { currentUser, currentPost } = store.getState()

      const newCitation = new Citation(
        randomID(),
        payload.value,
        highlightedText,
        payload.url
      )
      if (payload.id !== '') {
        const action = {
          type: 'newCitation',
          from: sel.from,
          to: sel.to,
          citation: newCitation,
          generatedPostId: payload.id,
        }

        if (currentPost) {
          action.post_id = currentPost.currentPost.id
        }

        if (currentUser && currentUser.currentUser) {
          action.user_id = currentUser.currentUser.id
        }

        dispatch(state.tr.setMeta(citationPlugin, action))
      } else {
        const token = document.head.querySelector('[name~=csrf-token][content]')
          .content
        const data = {
          post: {
            title: payload.value,
            body: '',
            user_id: currentUser.currentUser.id,
          },
        }
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
          const newCitation = new Citation(
            randomID(),
            payload.value,
            highlightedText,
            result.body.post.slug
          )

          const action = {
            type: 'newCitation',
            from: sel.from,
            to: sel.to,
            generatedPostId: result.body.post.id,
            citation: newCitation,
          }

          dispatch(state.tr.setMeta(citationPlugin, action))
        })
      }
      handleClose()
    }

    ReactDOM.render(
      <CitationSearch
        onCancel={handleClose}
        onHandleSubmit={handleNewCitation}
        view={view}
      />,
      root
    )
  }
  return true
}

function submitCitationCreate(action) {
  var { currentUser, currentPost } = store.getState()
  var url = '/add_citation'
  var data = {
    citation: {
      generated_post_id: action.generatedPostId,
      title: action.citation.value,
      highlighted_text: action.citation.highlightedText,
      data_to: action.to,
      data_from: action.from,
      data_key: action.citation.id,
    },
  }

  if (currentPost) {
    data.citation.post_id = currentPost.currentPost.id
  }

  if (currentUser && currentUser.currentUser) {
    data.citation.user_id = currentUser.currentUser.id
  }

  submitRequest(data, url)
}

function submitCitationDelete(action) {
  var url = '/remove_citation'
  var data = {
    citation: {
      data_key: action.citation.id,
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

export const citationPlugin = new Plugin({
  key: citationPluginKey,
  state: {
    init: CitationState.init,
    apply(tr, prev) {
      CitationState.init // eslint-disable-next-line no-unused-expressions
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

export const citationUI = function (transaction) {
  return new Plugin({
    props: {
      decorations(state) {
        return citationTooltip(state, transaction)
      },
    },
  })
}

function citationTooltip(state, dispatch) {
  let sel = state.selection
  if (!sel.empty) return null
  let citations = citationPlugin.getState(state).citationsAt(sel.from)
  if (!citations.length) return null
  return DecorationSet.create(state.doc, [
    Decoration.widget(sel.from, renderCitations(citations, dispatch, state)),
  ])
}

function renderCitations(citations, dispatch, state) {
  const node = document.createElement('div')
  node.className = 'tooltip-wrapper animated fadeIn'
  ReactDOM.render(
    <ul className="citation-list">
      {citations.map((p, index) => {
        const isLast = index === citations.length - 1
        return (
          <ThreadedCitation
            key={index}
            citation={p.type.spec}
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

function ThreadedCitation(props) {
  const { citation, dispatch, state } = props

  const handleDelete = () => {
    dispatch(
      state.tr.setMeta(citationPlugin, { type: 'deleteCitation', citation })
    )
  }

  // function handleAdd() {
  // }

  var { currentUser } = store.getState()

  return (
    <div className="citation-show px-3" id={'citation-' + citation.id}>
      <div className="citation-highlight"> {citation.highlightedText} </div>
      <div className="citation-title">
        <a href={citation.url} target="blank">
          {/* TODO: refactor */}
          <div
            className="citation-title-text"
            dangerouslySetInnerHTML={{
              __html: `${
                citation.title.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, '') ||
                '[ No Title]'
              }`,
            }}
          ></div>
        </a>
      </div>
      {currentUser && currentUser.currentUser.attributes.name !== 'Anonymous' && (
        <div className="citation-actions">
          {/* <button className="btn btn-add" onClick={handleAdd}>
            Add
          </button> */}
          <button className="btn btn-remove" onClick={handleDelete}>
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
