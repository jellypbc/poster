import React, { useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import { saRequest } from '../utils/saRequest'

export default function TagForm({ post, suggestedTags, currentUser }) {
  const [tags, setTags] = useState(post.data.attributes.tags || [])
  const [suggestions, setSuggestions] = useState(suggestedTags || [])
  const [error, setError] = useState(null)

  const handleFocus = () => {
    let url = post.data.attributes.form_url + '/suggested_tags'
    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        if (res.status === 200) {
          setSuggestions(res.body)
        } else {
          setError('Oops, failed to fetch suggested tags')
        }
      })
  }
  const handleDelete = (i) => {
    const tagToDelete = tags.find((tag, index) => index === i)
    sendRequest(tagToDelete, 'delete').then((res) => {
      if (res.status === 200) {
        setTags(tags.filter((tag, index) => index !== i))
      } else {
        setError('Oops, something went wrong.')
      }
    })
  }

  const handleAddition = (tag) => {
    sendRequest(tag, 'add').then((res) => {
      if (res.status === 200) {
        setTags([...tags, tag])
      } else {
        setError('Oops, something went wrong.')
      }
    })
  }

  async function sendRequest(tag, action) {
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

    return new Promise((resolve, reject) => {
      saRequest[method](url)
        .send(data)
        .set('accept', 'application/json')
        .then((res) => {
          console.log('res', res)
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

  return (
    <div className="form-group">
      {error && <div className="error">{error}</div>}
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleInputFocus={() => handleFocus()}
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
