import React from 'react'
import Autosuggest from 'react-autosuggest'
import superagent from 'superagent'

class SearchBar extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
      suggestions: [],
      // isActive: false
    }
  }

  componentDidMount() {
    // remove the fallback searchbar
    var placeholder = document.getElementById('search-fallback')[0]
    placeholder.remove()

    var searchbar = document.getElementsByClassName('search-bar')[0]
    searchbar.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        window.location = '/search/results?query=' + this.state.value
      }
    })
  }

  getSuggestionValue = (suggestion) => suggestion.title || ''

  fetchSearchResults = (value) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    if (inputLength === 0) return []

    var query = value
    const url = '/search/bar?query=' + query
    let suggestions = []

    superagent
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        console.log(res.body)
        suggestions = res.body
        this.setState({ suggestions: suggestions })
      })
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.fetchSearchResults(value)
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  renderSuggestion = (suggestion) => {
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

  render() {
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange,
    }

    const theme = {
      input: 'form-control',
      suggestionsList: 'suggestionsList',
    }

    // var style = this.state.isActive ? {width: '400px'} : {width: '193px'}

    return (
      <div className="search-bar">
        <Autosuggest
          className="searchthing"
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          renderSectionTitle={() => null}
          getSectionSuggestions={() => null}
          inputProps={inputProps}
          theme={theme}
        />
      </div>
    )
  }
}

export default SearchBar
