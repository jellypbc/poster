/* eslint-disable no-unused-expressions */
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { CitationSearch } from '../CitationSearch'

import ReactDOM from 'react-dom'
import React from 'react'
import { saRequest } from '../../utils/saRequest'
import parse from 'html-react-parser'
import classnames from 'classnames'
import { store } from '../../store'
import {v4 as uuidv4} from 'uuid'

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

  citationsAt(pos) {
    return this.decos.find(pos, pos)
  }

  allCitations() {
    let { decos } = this
    const citations = decos.find().map((citation) => {
      return {
        to: citation.to,
        from: citation.from,
        id: citation.type.spec.id,
        text: citation.type.spec.title,
        highlightedText: citation.type.spec.highlightedText,
      }
    })
    return citations
  }

  apply(tr) {
    let action = tr.getMeta(citationPlugin),
      actionType = action && action.type
    if (!action && !tr.docChanged) return this
    let base
    base = this
    let { decos } = base
    decos = decos.map(tr.mapping, tr.doc)

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
    const existingCitations = config.doc.citations.citations || []

    let decos = existingCitations.map((c) =>
      deco(c.from, c.to, new Citation(c.id, c.title, c.highlightedText, c.url))
    )

    return new CitationState(DecorationSet.create(config.doc, decos))
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
      var { currentUser, currentPost } = store.getState()

      const newCitation = new Citation(
        uuidv4(),
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
        const data = {
          post: {
            title: payload.value,
            body: '',
            user_id: currentUser.currentUser.id,
          },
        }
        const url = '/posts'

        let p = new Promise(function (resolve, reject) {
          saRequest
            .post(url)
            .send(data)
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
            uuidv4(),
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
      title: action.citation.title,
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
  saRequest
    .post(url)
    .send(data)
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

  var { currentUser } = store.getState()

  const sanitizedTitle = parse(
    `${
      citation.title.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, '') || '[ Untitled ]'
    }`
  )

  return (
    <div className="citation-show px-3" id={'citation-' + citation.id}>
      <div className="citation-highlight"> {citation.highlightedText} </div>
      <div className="citation-title">
        <a href={citation.url} target="blank">
          <div className="citation-title-text">{sanitizedTitle}</div>
        </a>
      </div>
      {currentUser && currentUser.currentUser.attributes.name !== 'Anonymous' && (
        <div className="citation-actions">
          <button className="btn btn-remove" onClick={handleDelete}>
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
