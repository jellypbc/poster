import React, { useState } from 'react'
import Autosuggest from 'react-autosuggest'

import { Floater } from './Floater'
import { saRequest } from '../utils/saRequest'
import { store } from '../store'

export function CitationSearch({ onCancel, onHandleSubmit, view }) {
  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')
  const [id, setId] = useState('')
  const [url, setUrl] = useState('')

  const { currentPostId } = store.getState().currentPost.currentPost.id || ''

  const onSuggestionsFetchRequested = (input) => getSuggestions(input)

  const getSuggestions = (input) => {
    const inputValue = input.value.trim().toLowerCase()
    const inputLength = inputValue.inputLength

    if (inputLength === 0) return []

    let query = input.value
    const url = '/search/bar?query=' + query
    let suggestions

    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        suggestions = res.body
        setSuggestions(suggestions)
      })
  }

  const onSuggestionsClearRequested = () => setSuggestions([])

  const getSuggestionValue = (suggestion) => suggestion.title || ''

  const renderSuggestion = (suggestion) => {
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

  const handleClick = (data) => {
    setValue(data.attributes.title)
    setUrl(data.links.post_url)
  }

  const truncateTitle = (title) => {
    if (title.length > 80) {
      return title.slice(0, 80) + '...'
    } else {
      return title
    }
  }

  const onSuggestionSelected = (event, { suggestion }) => {
    setValue(suggestion.data.attributes.title.trim())
    setId(suggestion.data.id)
  }

  const onChange = (event, { newValue }) => {
    setValue(newValue)
  }

  const onKeyDown = (event) => {
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

  const inputRef = (autosuggest) => {
    if (autosuggest != null) {
      return autosuggest.input.focus({ preventScroll: true })
    }
  }

  const handleFormSubmit = () => {
    onHandleSubmit({ id, value, currentPostId, url })
  }

  const theme = {
    input: 'form-control',
    suggestionsList: 'citationSuggestionsList',
  }

  const inputProps = {
    placeholder: 'Search',
    value: value,
    onChange: onChange,
    onKeyDown: onKeyDown,
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
