import React from 'react'
import Autosuggest from 'react-autosuggest'

import superagent from 'superagent'

const languages = [
  {
    name: 'C',
    year: 1972
  },
]

class SearchBar extends React.Component {

  constructor(){
    super()
    this.state = {
      value: "",
      suggestions: []
    }

  }

  request(value){
    var query = value || this.state.value
    const url = "/search/bar?query=" + query
    let suggestions = []

    superagent.get(url)
      .set('accept', 'application/json')
      .then(res => {
        suggestions = res.body
        this.setState({suggestions: res.body })
      })

    return suggestions
  }


  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return []; }
    const regex = new RegExp('^' + escapedValue, 'i');
    // return this.state.suggestions.filter(suggestion => regex.test(suggestion.title));
    return this.request(value)
  }

  getSuggestionValue(suggestion) {
    return suggestion.title;
  }

  shouldRenderSuggestions(suggestion) {
    console.log("true")
  }

  renderSuggestion(suggestion) {
    return (
      <span>
        post
      </span>
    );
  }

  renderSuggestionsContainer({ containerProps, children, query }) {
    return (
      <div {...containerProps}>
        {children}
        <div>
          Press Enter to search <strong>{query}</strong>
        </div>
      </div>
    )
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    // this.request(value)
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
    };

    return(
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          renderSuggestion={this.renderSuggestion}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          inputProps={inputProps}
        />
      </div>
    )
  }
}

export default SearchBar