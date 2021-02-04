import React, { useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import { saRequest } from '../utils/saRequest'

interface Props {
  post: any
  suggestedTags: any
  currentUser: any
}

export const TagForm: React.FC<Props> = ({ post, suggestedTags, currentUser }) => {
  const [tags, setTags] = useState(post.data.attributes.tags || [])
  const [suggestions, setSuggestions] = useState<Array<any>>(suggestedTags || [])
  const [error, setError] = useState<string| null>(null)

  const handleFocus = () => {
    const url = post.data.attributes.form_url + '/suggested_tags'
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
    sendRequest(tagToDelete, 'delete').then((res: any) => {
      if (res.status === 200) {
        console.log('res', res)
        setTags(tags.filter((tag, index) => index !== i))
      } else {
        setError('Oops, something went wrong.')
      }
    })
  }

  const handleAddition = (tag) => {
    sendRequest(tag, 'add').then((res: any) => {
      if (res.status === 200) {
        setTags([...tags, tag])
      } else {
        setError('Oops, something went wrong.')
      }
    })
  }

  async function sendRequest(tag, action) {
    const data = {
      tag: {
        user_id: currentUser.id,
        text: tag.text,
        slug: tag.slug,
        post_id: post.data.id,
        id: tag.id,
        deleted_at: tag.deletedAt
      },
    }

    let url, method
    if (action === 'add') {
      url = '/posts/' + post.data.attributes.slug + '/tags'
      method = 'post'
    } else {
      // console.log('tag.id', data.tag)
      data.tag.id = tag.id
      data.tag.deleted_at = true
      url = '/posts/' + post.data.attributes.slug + '/remove_tag'
      method = 'post'
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
          setError(err.message)
        })
    })
  }

  return (
    <div className="form-group">
      {error && <div className="error">{error}</div>}
      <br />
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

export default TagForm