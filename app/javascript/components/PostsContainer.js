import React, { useState } from 'react'
import PostsList from './PostsList'
import TabGroup from './TabGroup'
import ReactPaginate from 'react-paginate'

import { saRequest } from '../utils/saRequest'

export default function PostsContainer(props) {
  const { postPageCount, citationPageCount } = props
  const TAB_GROUP = [
    { value: '1', label: 'posts' },
    { value: '2', label: 'citations' },
  ]

  const [tabState, setTabState] = useState('1')

  const [posts, setPosts] = useState(
    tabState === '1' ? props.posts : props.citations
  )
  console.log('posts', posts)

  const handleChange = (e) => {
    setTabState(e.value)
  }

  // const posts = () => {
  //   return tabState === '1' ? props.posts : props.citations
  // }

  const pageCount = () => {
    return tabState === '1' ? postPageCount : citationPageCount
  }

  const getPostsFromPage = (page) => {
    console.log('page number', page)
    // TODO: replace @cindy
    const url = '@cindy/posts_paginated/' + page
    console.log('url', url)
    let posts
    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        posts = res.body
        console.log('posts', posts)
      })
  }

  const handlePageClick = (e) => {
    console.log('page clicked', e)
    getPostsFromPage(e.selected + 1)
  }

  return (
    <div>
      <TabGroup
        name="exampleOne"
        value={tabState}
        option={TAB_GROUP}
        onChange={(e) => handleChange(e)}
        postsCount={props.postsCount}
        citationsCount={props.citationsCount}
      />
      <PostsList posts={posts} />
      <ReactPaginate
        previousLabel={'<-'}
        nextLabel={'->'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount()}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(e) => handlePageClick(e)}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>
  )
}
