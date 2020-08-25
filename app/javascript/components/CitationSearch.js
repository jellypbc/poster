import React, { useState } from 'react'
import Floater from './Floater'
import Autosuggest from 'react-autosuggest'
import superagent from 'superagent'
import { store } from './store'

export default function CitationSearch({ onCancel, onHandleSubmit, view }) {
  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')
  const [id, setId] = useState('')
  const [url, setUrl] = useState('')

  var { currentPostId } = store.getState().currentPost.currentPost.id || ''

  const inputProps = {
    placeholder: 'Search',
    value: value,
    onChange: onChange,
    onKeyDown: onKeyDown,
  }

  const theme = {
    input: 'form-control',
    suggestionsList: 'citationSuggestionsList',
  }

  function onSuggestionsFetchRequested(input) {
    getSuggestions(input)
  }

  function getSuggestions(input) {
    const inputValue = input.value.trim().toLowerCase()
    const inputLength = inputValue.inputLength

    if (inputLength === 0) return []

    var query = input.value
    const url = '/search/bar?query=' + query
    let suggestions

    superagent
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        suggestions = res.body
        setSuggestions(suggestions)
      })
  }

  function onSuggestionsClearRequested() {
    setSuggestions([])
  }

  function getSuggestionValue(suggestion) {
    // eslint-disable-next-line no-unused-expressions
    suggestion.title || ''
  }

  function renderSuggestion(suggestion) {
    const { data } = suggestion
    return (
      <div
        className="suggestion-row"
        role="button"
        onClick={() => handleClick(data)}
        onKeyPress={() => handleClick(data)}
        tabIndex={0}
      >
        {data.attributes.title && (
          <p className="suggestion-title">
            {truncateTitle(data.attributes.title)}
          </p>
        )}
      </div>
    )
  }

  function handleClick(data) {
    console.log('data', data)
    setValue(data.attributes.title)
    setUrl(data.links.post_url)
  }

  function truncateTitle(title) {
    if (title.length > 80) {
      return title.slice(0, 80) + '...'
    } else {
      return title
    }
  }

  function onSuggestionSelected(event, { suggestion }) {
    setValue(suggestion.data.attributes.title.trim())
    setId(suggestion.data.id)
  }

  function onChange(event, { newValue, method }) {
    setValue(newValue)
  }

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      let suggestion
      if (suggestions.length > 0) {
        suggestion = suggestions[0]
      }

      if (
        suggestion &&
        suggestion.data.attributes.title
          .toLowerCase()
          .includes(value.toLowerCase())
      ) {
        setId(suggestion.data.id)
      }
    }
  }

  function inputRef(autosuggest) {
    if (autosuggest != null) {
      return autosuggest.input.focus({ preventScroll: true })
    }
  }

  function handleFormSubmit() {
    onHandleSubmit({ id, value, currentPostId, url })
  }

  return (
    <div className="citation-form-container">
      <Floater view={view}>
        <div className="citation-search shadow">
          <div className="d-inline-block">
            <Autosuggest
              id="citation-search"
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              renderSectionTitle={() => null}
              getSectionSuggestions={() => null}
              onSuggestionSelected={onSuggestionSelected}
              inputProps={inputProps}
              theme={theme}
              ref={inputRef}
            />
          </div>
          <div className="button-row">
            <button
              type="button"
              className="button btn btn-primary btn-sm"
              onClick={handleFormSubmit}
            >
              Submit
            </button>
            &nbsp;
            <button
              type="button"
              className="button btn btn-sm o"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </Floater>
    </div>
  )
}
