import React, { useState, useEffect } from 'react'
import PostsList from './PostsList'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'

export default function PostsContainer() {
  // CINDY TODO: add isLoading
  const [data, setData] = useState([])
  const [pageCount, setPageCount] = useState()
  const [page] = useState(1)

  useEffect(() => {
    getPostsFromPage(page)
  }, [page])

  const getPostsFromPage = (page) => {
    let p = new Promise(function (resolve, reject) {
      saRequest
        // CINDY TODO: fix this URL
        .get('http://localhost:3000/paginated_posts/' + page)
        .set('accept', 'application/json')
        .then((res) => {
          console.log('res', res)
          resolve(res)
        })
        .catch((err) => {
          console.log(err.message)
        })
    })
    p.then((result) => {
      setData(result.body.posts)
      setPageCount(result.body.page_count)
    })
  }

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
