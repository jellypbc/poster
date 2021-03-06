import React, { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'

import { saRequest } from '../utils/saRequest'

export const SearchBar: React.FC = () => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const docu = document.getElementById('search-fallback')
    const placeholder = docu != null ? docu[0] : null
    if (placeholder) placeholder.remove()

    const searchbar = document.getElementsByClassName('search-bar')[0]
    searchbar.addEventListener('keyup', (event: any) => {
      if (event.keyCode === 13) {
        window.location.href = '/search/results?query=' + value
      }
    })
  })

  const getSuggestionValue = (suggestion) => suggestion.title || ''

  const fetchSearchResults = (value) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    if (inputLength === 0) return []

    const query = value
    const url = '/search/bar?query=' + query
    let suggestions = []

    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        console.log(res.body)
        suggestions = res.body
        setSuggestions(suggestions)
      })
  }

  const onChange = (event, { newValue, method }) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSearchResults(value)
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const renderSuggestion = (suggestion) => {
    const { data } = suggestion
    return (
      <div className="suggestion-row">
        <a href={data.links.post_url} target="_blank" rel="noopener noreferrer">
          {data.attributes.title && (
            <p className="suggestion-title">{data.attributes.title}</p>
          )}
          {data.attributes.created_at && (
            <p className="suggestion-date">{data.attributes.created_at}</p>
          )}
        </a>
      </div>
    )
  }

  const inputProps = {
    placeholder: 'Search',
    value,
    onChange: onChange,
  }

  const theme = {
    input: 'form-control',
    suggestionsList: 'suggestionsList',
  }

  return (
    <div className="search-bar">
      <Autosuggest
        className="searchthing"
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={() => null}
        getSectionSuggestions={() => null}
        inputProps={inputProps}
        theme={theme}
      />
    </div>
  )
}

export default SearchBar