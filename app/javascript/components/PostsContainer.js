import React, { useState, useEffect, useCallback } from 'react'
import PostsList from './PostsList'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'

export default function PostsContainer(props) {
  // CINDY TODO: add isLoading
  const [data, setData] = useState([])
  const [pageCount, setPageCount] = useState()
  const [page] = useState(1)

  const getPostsFromPage = useCallback((page) => {
    let url =
      props.tag !== undefined
        ? 'http://localhost:3000/tags/' +
          props.tag.id +
          '/paginated_posts/' +
          page
        : 'http://localhost:3000/users/' +
          props.user.id +
          '/paginated_posts/' +
          page
    saRequest
      .get(url)
      .set('accept', 'application/json')
      .send(data)
      .then((res) => {
        console.log('res', res)
        setData(res.body.posts)
        setPageCount(res.body.page_count)
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  useEffect(() => {
    getPostsFromPage(page)
  }, [getPostsFromPage, page])

  const handlePageClick = (e) => {
    let page = e.selected + 1
    getPostsFromPage(page)
  }

  return (
    <div>
      <PostsList posts={data} />
      <ReactPaginate
        previousLabel={'←'}
        nextLabel={'→'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
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
