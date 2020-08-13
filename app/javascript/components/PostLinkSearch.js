import React from 'react'
import Autosuggest from 'react-autosuggest'
import superagent from 'superagent'
import Floater from './Floater'
import { store } from './store'

class PostLinkSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      value: '',
      suggestions: [],
      currentPostId: store.getState().currentPost.currentPost.id || '',
    }
  }

  getSuggestionValue = (suggestion) => suggestion.title || ''

  getSuggestions = (value) => {
    console.log('value', value)
    const inputValue = value.trim().toLowerCase()
    console.log('value2', value)
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

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      let suggestion
      if (this.state.suggestions.length > 0) {
        suggestion = this.state.suggestions[0]
      }

      if (
        suggestion &&
        suggestion.data.attributes.title
          .toLowerCase()
          .includes(this.state.value.toLowerCase())
      ) {
        this.setState({
          id: suggestion.data.id,
        })
      }
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value)
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      value: suggestion.data.attributes.title.trim(),
      id: suggestion.data.id,
    })
  }

  handleFormSubmit = () => {
    this.props.onHandleSubmit(this.state)
  }

  handleClick(data) {
    this.setState({ value: data.attributes.title })
  }

  renderSuggestion = (suggestion) => {
    const { data } = suggestion
    return (
      <div
        className="suggestion-row"
        role="button"
        onClick={() => this.handleClick(data)}
        onKeyPress={() => this.handleClick(data)}
        tabIndex={0}
      >
        {data.attributes.title && (
          <p className="suggestion-title">{data.attributes.title}</p>
        )}
      </div>
    )
  }

  inputRef = (autosuggest) => {
    if (autosuggest != null) {
      this.input = autosuggest.input.focus()
    }
  }

  render() {
    const { onCancel, view } = this.props
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
    }

    const theme = {
      input: 'form-control',
      suggestionsList: 'postLinkSuggestionsList',
    }

    // const autosuggestStyle = {
    //   'width': '300px',
    //   'display': 'inline-block',
    //   'margin-right': '10px',
    // }

    const containerStyle = {
      display: 'inline-block',
      background: 'white',
      padding: '6px',
    }

    const buttonRow = {
      display: 'inline-block',
    }

    const buttonStyle = {
      padding: '9px 10px 8px 10px',
      top: '-1px',
      position: 'relative',
    }

    return (
      <div>
        <Floater view={view}>
          <div className="postlinksearch shadow rounded" style={containerStyle}>
            <div className="d-inline-block">
              <Autosuggest
                id="postlinksearch"
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                renderSectionTitle={() => null}
                getSectionSuggestions={() => null}
                onSuggestionSelected={this.onSuggestionSelected}
                inputProps={inputProps}
                theme={theme}
                ref={this.inputRef}
              />
            </div>
            <div className="button-row" style={buttonRow}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={this.handleFormSubmit}
                style={buttonStyle}
              >
                Submit
              </button>
              &nbsp;
              <button type="button" className="btn btn-sm o" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </Floater>
      </div>
    )
  }
}

export default PostLinkSearch
