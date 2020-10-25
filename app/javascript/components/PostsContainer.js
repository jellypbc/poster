import React, { useState } from 'react'
import PostsList from './PostsList'
import TabGroup from './TabGroup'

export default function PostsContainer(props) {
  const TAB_GROUP = [
    { value: '1', label: 'posts' },
    { value: '2', label: 'citations' },
  ]

  const [tabState, setTabState] = useState('1')

  const handleChange = (e) => {
    setTabState(e.value)
  }

  const posts = () => {
    return tabState === '1' ? props.posts : props.citations
  }

  return (
    <div>
      <TabGroup
        name="exampleOne"
        value={tabState}
        option={TAB_GROUP}
        onChange={(e) => handleChange(e)}
        postsCount={props.posts.length}
        citationsCount={props.citations.length}
      />
      <PostsList posts={posts()} />
    </div>
  )
}
