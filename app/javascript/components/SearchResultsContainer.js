import React, { useState, useEffect, useCallback } from 'react'
import PostsList from './PostsList'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'

export default function SearchResultsContainer({ query }) {
  const [hasPosts, setHasPosts] = useState(true)
  const [showPagination, setShowPagination] = useState(false)
  const [pageCount, setPageCount] = useState()
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [, setError] = useState()

  const getSearchResults = useCallback(() => {
    const generateUrl = () => {
      return '/search/paginated_results/' + page + '?query=' + query
    }

    let url = generateUrl()

    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res) => {
        console.log('res', res)
        setData(res.body.posts)
        setPageCount(res.body.page_count)
        setShowPagination(res.body.page_count > 1 ? true : false)
        setHasPosts(res.body.posts.length !== 0 ? true : false)
      })
      .catch((err) => {
        console.log('err.message', err.message)
        setError(err.message)
      })
  }, [page, query])

  useEffect(() => {
    getSearchResults()
  }, [getSearchResults, page])

  const handlePageClick = (e) => {
    setPage(e.selected + 1)
  }

  return (
    <div>
      {hasPosts && <PostsList posts={data} />}
      {showPagination && (
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
          forcePage={page - 1}
        />
      )}
    </div>
  )
}
