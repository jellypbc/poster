import React, { useState } from 'react'
import PostsList from './PostsList'

export default function SearchResultsContainer({ results }) {
  const [hasPosts, setHasPosts] = useState(results.length ? true : false)

  const noPosts = () => {
    return <p className="muted">No results.</p>
  }

  return <div>{hasPosts ? <PostsList posts={results} /> : noPosts()}</div>
}
