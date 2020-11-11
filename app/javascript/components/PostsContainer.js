import React, { useState, useEffect, useCallback } from 'react'
import PostsList from './PostsList'
import TabGroup from './TabGroup'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'

export default function PostsContainer(props) {
  console.log('props', props)
  // CINDY TODO: add isLoading
  const TAB_GROUP = [
    { value: '1', label: 'posts' },
    { value: '2', label: 'citations' },
  ]
  const [tabState, setTabState] = useState('1')
  const [data, setData] = useState([])
  const [pageCount, setPageCount] = useState()
  const [page, setPage] = useState(1)
  const [showPagination, setShowPagination] = useState(false)
  const [hasPosts, setHasPosts] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPostsFromPage = useCallback(() => {
    const generateUrl = () => {
      const type = props.tag ? 'tags' : 'users'
      const id = props.tag ? props.tag.id : props.user.id
      const tab = tabState === '1' ? 'posts' : 'citations'
      return (
        'http://localhost:3000/' +
        type +
        '/' +
        id +
        '/paginated_' +
        tab +
        '/' +
        page
      )
    }

    let url = generateUrl()
    saRequest
      .get(url)
      .set('accept', 'application/json')
      .send(data)
      .then((res) => {
        console.log('res', res)
        setData(res.body.posts)
        setPageCount(res.body.page_count)
        setShowPagination(res.body.page_count > 1 ? true : false)
        setHasPosts(res.body.posts.length !== 0 ? true : false)
      })
      .catch((err) => {
        console.log(err.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tabState])

  useEffect(() => {
    getPostsFromPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tabState])

  const handlePageClick = (e) => {
    setPage(e.selected + 1)
  }

  const handleTabChange = (e) => {
    setPage(1)
    setTabState(e.value)
  }

  const tabGroup = () => {
    let tab =
      props.isLibrary === true ? null : (
        <TabGroup
          name="postTabGroup"
          value={tabState}
          option={TAB_GROUP}
          onChange={(e) => handleTabChange(e)}
          postsCount={props.postsCount}
          citationsCount={props.citationsCount}
        />
      )
    return tab
  }

  const noPosts = () => {
    return <p className="muted my-5">No posts added yet.</p>
  }

  return (
    <div>
      {tabGroup()}
      {hasPosts ? <PostsList posts={data} /> : noPosts()}
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
