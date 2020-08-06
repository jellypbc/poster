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

  componentDidMount() {
    this.input.focus()
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
    this.fetchSearchResults(value)
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
    if (!this.state.id) {
      this.requestGeneratePost()
    } else {
      this.requestAddCitation()
    }
  }

  requestGeneratePost() {
    const token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    const data = { post: { title: this.state.value } }
    const url = '/posts'

    superagent
      .post(url)
      .send(data)
      .set('X-CSRF-Token', token)
      .set('accept', 'application/json')
      .then((res) => {
        var id = res.body.post.id
        this.setState({ id: id }, this.requestAddCitation(id))
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  requestAddCitation(generated_post_id) {
    const token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    const { id, value, currentPostId } = this.state
    const url = '/add_citation'
    const data = {
      citation: {
        generated_post_id: generated_post_id || id,
        title: value,
        post_id: currentPostId,
      },
    }

    superagent
      .post(url)
      .send(data)
      .set('X-CSRF-Token', token)
      .then((res) => {
        console.log('citation response', res.body)
      })
      .catch((err) => {
        console.log(err.message)
      })
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
        tabIndex={1}
      >
        {data.attributes.title && (
          <p className="suggestion-title">
            {data.attributes.title}
          </p>
        )}
      </div>
    )
  }

  storeInputReference = (autosuggest) => {
    if (autosuggest != null) {
      this.input = autosuggest.input
    }
  }

  render() {
    const { belly, view } = this.props
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

    const autosuggestStyle = {
      'width': '300px',
      'display': 'inline-block',
      'margin-right': '10px',
    }

    const containerStyle = {
      'display': 'inline-block',
      'background': 'white',
      'padding': '6px',
    }

    const buttonRow = {
      'display': 'inline-block'
    }

    const buttonStyle = {
      'padding': '9px 10px 8px 10px',
      'top': '-1px',
      'position': 'relative',
    }

    return (
      <div>
        <Floater view={view}>
          <div
            className="postlinksearch shadow rounded"
            style={containerStyle}
          >
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
                ref={this.storeInputReference}
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
              <button
                type="button"
                className="btn btn-sm o"
                onClick={belly}
              >
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
