import React, { useState, useEffect, useCallback } from 'react'
import PostsList from './PostsList'
import TabGroup from './TabGroup'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'

export default function PostsContainer(props) {
  // CINDY TODO: add isLoading
  const TAB_GROUP = [
    { value: '1', label: 'posts' },
    { value: '2', label: 'citations' },
  ]
  const [tabState, setTabState] = useState('1')
  const [data, setData] = useState([])
  const [pageCount, setPageCount] = useState()
  const [page, setPage] = useState(1)

  const getPostsFromPage = useCallback(() => {
    let url =
      props.tag !== undefined
        ? tabState === '1'
          ? 'http://localhost:3000/tags/' +
            props.tag.id +
            '/paginated_posts/' +
            page
          : 'http://localhost:3000/tags/' +
            props.tag.id +
            '/paginated_citations/' +
            page
        : tabState === '1'
        ? 'http://localhost:3000/users/' +
          props.user.id +
          '/paginated_posts/' +
          page
        : 'http://localhost:3000/users/' +
          props.user.id +
          '/paginated_citations/' +
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
    setPage(e.selected + 1)
    getPostsFromPage(page)
  }

  const handleChange = (e) => {
    setTabState(e.value)
    setPage(1)
  }

  const tabGroup = () => {
    let tab =
      props.isLibrary === true ? null : (
        <TabGroup
          name="exampleOne"
          value={tabState}
          option={TAB_GROUP}
          onChange={(e) => handleChange(e)}
          postsCount={props.postsCount}
          citationsCount={props.citationsCount}
        />
      )
    return tab
  }

  return (
    <div>
      {tabGroup()}
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
