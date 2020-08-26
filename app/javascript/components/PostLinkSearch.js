import React, { useState } from 'react'
import Floater from './Floater'
import Autosuggest from 'react-autosuggest'
import superagent from 'superagent'
import { store } from './store'

export default function PostLinkSearch({ onCancel, onHandleSubmit, view }) {
  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')
  const [id, setId] = useState('')
  const [currentPostId, setCurrentPostId] = useState(
    store.getState().currentPost.currentPost.id || ''
  )

  const inputProps = {
    placeholder: 'Search',
    value,
    onChange: onChange,
    onKeyDown: onKeyDown,
  }

  const theme = {
    input: 'form-control',
    suggestionsList: 'postLinkSuggestionsList',
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
  }

  function truncateTitle(title) {
    if (title.length > 75) {
      return title.slice(0, 75) + '...'
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
    onHandleSubmit({ id, value, suggestions, currentPostId })
  }

  return (
    <div>
      <Floater view={view}>
        <div className="postlinksearch search-container shadow rounded">
          <div className="d-inline-block">
            <Autosuggest
              id="postlinksearch"
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