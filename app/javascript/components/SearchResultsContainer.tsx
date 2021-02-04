import React, { useState, useEffect, useCallback } from 'react'
import { PostsList } from './PostsList'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'

interface Props {
  query: string
}

export const SearchResultsContainer: React.FC<Props> = ({ query }) => {
  const [hasPosts, setHasPosts] = useState<boolean>(true)
  const [showPagination, setShowPagination] = useState<boolean>(false)
  const [pageCount, setPageCount] = useState<number>()
  const [page, setPage] = useState<number>(1)
  const [data, setData] = useState<Array<any>>([])
  const [, setError] = useState<any>()

  const getSearchResults = useCallback(() => {
    const generateUrl = () => {
      return '/search/paginated_results/' + page + '?query=' + query
    }

    const url = generateUrl()

    saRequest
      .get(url)
      .set('accept', 'application/json')
      .then((res: any) => {
        console.log('res', res)
        setData(res.body.posts)
        setPageCount(res.body.page_count)
        setShowPagination(res.body.page_count > 1 ? true : false)
        setHasPosts(res.body.posts.length !== 0 ? true : false)
      })
      .catch((err: any) => {
        console.log('err.message', err.message)
        setError(err.message)
      })
  }, [page, query])

  useEffect(() => {
    getSearchResults()
  }, [getSearchResults, page])

  const handlePageClick = (e: any) => {
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
          onPageChange={(e: any) => handlePageClick(e)}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          forcePage={page - 1}
        />
      )}
    </div>
  )
}

export default SearchResultsContainer