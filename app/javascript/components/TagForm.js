import React from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import superagent from 'superagent'

class TagForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tags: this.props.taggable.data.attributes.tags || [],
      suggestions: this.props.suggested_tags || []
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleFocus(){
    const { taggable } = this.props
    var url = taggable.data.attributes.form_url + "/suggested_tags"
    superagent.get(url)
      .set('accept', 'application/json')
      .then(res => {
        if (res.status === 200) {
          this.setState({suggestions: res.body})
        } else {
          this.setState({error: "Oops, failed to fetch suggested tags"})
        }
      })
  }

  handleDelete(i) {
    const { tags } = this.state;
    const tagToDelete = tags.find((tag, index) => index === i)

    this.sendRequest(tagToDelete, 'delete').then(res => {
      if (res.status === 200) {
        this.setState({
          tags: tags.filter((tag, index) => index !== i),
        });
      } else {
        this.setState({error: "Oops, something went wrong."})
      }
    })
  }

  handleAddition(tag) {
    this.sendRequest(tag, 'add').then(res => {
      if (res.status === 200) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
      } else {
        this.setState({error: "Oops, something went wrong."})
      }
    })
  }

  async sendRequest(tag, action){
    const { taggable } = this.props
    const token = document.head
      .querySelector('[name~=csrf-token][content]')
      .content

    var data = {
      tag: {
        text: tag.text,
        slug: tag.slug,
        taggable_id: taggable.data.id,
        taggable_type: taggable.data.type,
      }
    }

    let url, method;
    if (action === 'add') {
      url = taggable.data.attributes.form_url + "/tags"
      method = "post"
    } else {
      data.tag.id = tag.id
      url = taggable.data.attributes.form_url + "/tags/" + tag.id
      method = "delete"
    }

    return new Promise(function(resolve, reject){
      superagent[method](url)
        .send(data)
        .set('X-CSRF-Token', token)
        .set('accept', 'application/json')
        .then(res => {
          return res
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          this.setState({
            error: err.message
          })
        });
    })
  }

  render() {
    return (
      <div className="form-group">
        {this.state.error &&
          <div className="error">
            {this.state.error}
          </div>
        }
        <ReactTags
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleInputFocus={this.handleFocus}
          allowDragDrop={false}
          placeholder="Add new tag"
          classNames={{
            tag: 'badge badge-secondary mr-2',
            tagInputField: 'form-control'
          }}
        />
      </div>
    )
  }
}

export default TagForm
