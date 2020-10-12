import React, { useState, useEffect } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import saRequest from '../utils/saRequest'

// TODO: figure out how to handle async function and promise :(

// export default function TagForm({ post, suggestedTags, currentUser }) {
//   const [tags, setTags] = useState(post.data.attributes.tags || [])
//   const [suggestions, setSuggestions] = useState(suggestedTags || [])
//   const [error, setError] = useState(null)

//   const handleFocus = () => {
//     let url = post.data.attributes.form_url + '/suggested_tags'
//     saRequest
//       .get(url)
//       .set('accept', 'application/json')
//       .then((res) => {
//         if (res.status === 200) {
//           setSuggestions(res.body)
//         } else {
//           setError('Oops, failed to fetch suggested tags')
//         }
//       })
//   }
//   const handleDelete = (i) => {
//     const tagToDelete = tags.find((tag, index) => index === i)
//     sendRequest(tagToDelete, 'delete').then((res) => {
//       if (res.status === 200) {
//         setTags(tags.filter((tag, index) => index !== i))
//       } else {
//         setError('Oops, something went wrong.')
//       }
//     })
//   }

//   // do we need to do the prevTags thing
//   const handleAddition = (tag) => {
//     sendRequest(tag, 'add').then((res) => {
//       if (res.status === 200) {
//         setTags([...tags, tag])
//       } else {
//         setError('Oops, something went wrong.')
//       }
//     })
//   }

//   useEffect(() => {
//     async function sendRequest(tag, action) {
//       const data = {
//         tag: {
//           user_id: currentUser.id,
//           text: tag.text,
//           slug: tag.slug,
//           post_id: post.data.id,
//         },
//       }
//       let url
//       let method
//       if (action === 'add') {
//         url = post.data.attributes.form_url + '/tags'
//         method = 'post'
//       } else {
//         data.tag.id = tag.id
//         url = post.data.attributes.form_url + '/tags/' + tag.id
//         method = 'delete'
//       }

//       return new Promise(function (resolve, reject) {
//         saRequest[method](url)
//           .send(data)
//           .set('accept', 'application/json')
//           .then((res) => {
//             return res
//           })
//           .then((result) => {
//             resolve(result)
//           })
//           .catch((err) => {
//             setError(err.message)
//           })
//       })
//     }
//   })

//   return (
//     <div className="form-group">
//       {error && <div className="error">{error}</div>}
//       <ReactTags
//         tags={tags}
//         suggestions={suggestions}
//         handleDelete={handleDelete}
//         handleAddition={handleAddition}
//         handleInputFocus={() => handleFocus()}
//         allowDragDrop={false}
//         placeholder="Add new tag"
//         autofocus={false}
//         classNames={{
//           tag: 'badge badge-secondary mr-2',
//           tagInputField: 'form-control',
//         }}
//       />
//     </div>
//   )
// }

class TagForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tags: this.props.post.data.attributes.tags || [],
      suggestions: this.props.suggestedTags || [],
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleFocus() {
    const { post } = this.props
    var url = post.data.attributes.form_url + '/suggested_tags'
    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        if (res.status === 200) {
          this.setState({ suggestions: res.body })
        } else {
          this.setState({ error: 'Oops, failed to fetch suggested tags' })
        }
      })
  }

  handleDelete(i) {
    const { tags } = this.state
    const tagToDelete = tags.find((tag, index) => index === i)

    this.sendRequest(tagToDelete, 'delete').then((res) => {
      if (res.status === 200) {
        this.setState({
          tags: tags.filter((tag, index) => index !== i),
        })
      } else {
        this.setState({ error: 'Oops, something went wrong.' })
      }
    })
  }

  handleAddition(tag) {
    this.sendRequest(tag, 'add').then((res) => {
      if (res.status === 200) {
        this.setState((state) => ({ tags: [...state.tags, tag] }))
      } else {
        this.setState({ error: 'Oops, something went wrong.' })
      }
    })
  }

  async sendRequest(tag, action) {
    const { post, currentUser } = this.props

    var data = {
      tag: {
        user_id: currentUser.id,
        text: tag.text,
        slug: tag.slug,
        post_id: post.data.id,
      },
    }

    let url, method
    if (action === 'add') {
      url = post.data.attributes.form_url + '/tags'
      method = 'post'
    } else {
      data.tag.id = tag.id
      url = post.data.attributes.form_url + '/tags/' + tag.id
      method = 'delete'
    }

    return new Promise(function (resolve, reject) {
      saRequest[method](url)
        .send(data)
        .set('accept', 'application/json')
        .then((res) => {
          return res
        })
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          this.setState({
            error: err.message,
          })
        })
    })
  }

  render() {
    return (
      <div className="form-group">
        {this.state.error && <div className="error">{this.state.error}</div>}
        <ReactTags
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleInputFocus={() => this.handleFocus()}
          allowDragDrop={false}
          placeholder="Add new tag"
          autofocus={false}
          classNames={{
            tag: 'badge badge-secondary mr-2',
            tagInputField: 'form-control',
          }}
        />
      </div>
    )
  }
}

export default TagForm
