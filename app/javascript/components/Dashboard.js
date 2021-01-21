import React, { useState, useEffect, useCallback } from 'react'
import PostsList from './PostsList'
import TabGroup from './TabGroup'
import ReactPaginate from 'react-paginate'
import { saRequest } from '../utils/saRequest'
import { useEventListener } from '../utils/eventListener'
import { store } from '../store'

import filter from 'lodash/filter'
import map from 'lodash/map'

export default function Dashboard(props) {
  const TAB_GROUP = [
    { value: '1', label: 'posts' },
    { value: '2', label: 'citations' },
  ]
  const [tabState, setTabState] = useState('1')
  const [data, setData] = useState([])
  const [pageCount, setPageCount] = useState()
  const [page, setPage] = useState(1)
  const [showPagination, setShowPagination] = useState(false)
  const [hasPosts, setHasPosts] = useState(true)
  const [, setError] = useState()
  const [tagState, setTagState] = useState([])
  const [tags, setTags] = useState(props.tags.data || [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPostsFromPage = useCallback(() => {
    const generateUrl = () => {
      const type = props.tag ? 'tags' : 'users'
      const id = props.tag ? props.tag.id : props.user.id
      const tab = tabState === '1' ? 'posts' : 'citations'
      return '/' + type + '/' + id + '/paginated_' + tab + '/' + page
    }

    let url = generateUrl()

    saRequest
      .get(url)
      .set('accept', 'application/json')
      .send(data)
      .then((res) => {
        setData(res.body.posts)
        setPageCount(res.body.page_count)
        setShowPagination(res.body.page_count > 1 ? true : false)
        setHasPosts(res.body.posts.length !== 0 ? true : false)
      })
      .catch((err) => {
        setError(err.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tabState])

  useEffect(() => {
    if (props.posts) {
      setHasPosts(true)
      setData(props.posts)
    } else {
      getPostsFromPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tabState])

  useEffect(() => {
    let placeholder = document.getElementsByClassName('placeholder-content')[0]
    if (placeholder) {
      placeholder.remove()
    }

    let sidebar = document.getElementsByClassName('sidebar')[0]
    setMastheadHeight(sidebar.getBoundingClientRect().top)
    window.CommandBar.boot({
      id: props.user.id,
    })
  }, [props.user.id])

  const handlePageClick = (e) => {
    setPage(e.selected + 1)
  }

  const handleTabChange = (e) => {
    setPage(1)
    setTabState(e.value)
  }

  const tabGroup = () => {
    let tab =
      props.isDashboard === true ? null : (
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

  const addTagRequest = (postSlug, postID, tagSlug) => {
    let url = '/posts/' + postSlug + '/add_tag/'
    let data = {
      post_id: postSlug,
      tag_id: tagSlug,
      tag: {
        post_id: postSlug,
        id: tagSlug,
      },
    }

    saRequest
      .post(url)
      .set('accept', 'application/json')
      .send(data)
      .then((res) => {
        var updatedTag = res.body.data
        const newTags = [...tags]
        const tagsMap = map(newTags, function (t, i) {
          if (t.id === updatedTag.id) {
            newTags[i] = updatedTag
            return false
          }
        })
        setTags(newTags)

        var postRow = document.getElementById('post-' + postID)
        postRow.style.borderColor = '#d5e8d7'
        postRow.style.transitionDuration = '0s'

        setTimeout(function () {
          postRow.style.transitionDuration = '0.3s'
          postRow.style.transitionTimingFunction = 'ease-out'
          postRow.style.borderColor = 'transparent'
        }, 500)
      })
      .catch((err) => {
        var postRow = document.getElementById('post-' + postID)
        postRow.style.borderColor = '#e3bdba'
        postRow.style.transitionDuration = '0s'

        setTimeout(function () {
          postRow.style.transitionDuration = '0.3s'
          postRow.style.transitionTimingFunction = 'ease-out'
          postRow.style.borderColor = 'transparent'
        }, 500)
      })
  }

  const handleDrop = (event, tagID) => {
    event.preventDefault()
    var postSlug = event.dataTransfer.getData('postSlug')
    var postID = event.dataTransfer.getData('postID')
    if (event.target.parentNode.className == 'dropzone') {
      event.target.style.background = 'white'
    }
    addTagRequest(postSlug, postID, tagID)
  }

  const dragEnter = (event) => {
    event.preventDefault()
    if (event.target.parentNode.className == 'dropzone') {
      event.dataTransfer.effectAllowed = 'copyMove'
      event.target.style.background = '#def2d8'
      event.target.style.borderRadius = '3px'
    }
  }

  const dragLeave = (event) => {
    if (event.target.parentNode.className == 'dropzone') {
      event.target.style.background = 'white'
    }
  }

  const dragOver = (event) => {
    event.dataTransfer.dropEffect = 'copy'
    event.preventDefault()
  }
  const dragEnd = (event) => {
    event.preventDefault()
  }

  // begin sidebar sticky
  let pageHeight = document.getElementById('root').scrollHeight
  let sidebar = document.getElementsByClassName('sidebar')[0]
  const vpHeight = window.innerHeight

  const [sticky, setSticky] = useState(false)
  const [mastheadHeight, setMastheadHeight] = useState(0)

  const scrollHandler = useCallback(() => {
    setSticky(window.scrollY >= mastheadHeight ? true : false)
  }, [mastheadHeight])

  useEventListener('resize', scrollHandler)
  useEventListener('scroll', scrollHandler)

  const renderTags = (tags) => {
    var rendered = tags.map(function (tag) {
      return (
        <a
          key={tag.id}
          className="dropzone"
          onDrop={(e, tagID) => handleDrop(e, tag.id)}
          onDragEnter={(e) => dragEnter(e)}
          onDragLeave={(e) => dragLeave(e)}
          onDragOver={(e) => dragOver(e)}
          onDragEnd={(e) => dragEnd(e)}
          href={'/@' + tag.attributes.username + '/tags/' + tag.attributes.slug}
        >
          <p className="tag my-1">
            {tag.attributes.text}
            <span className="pill ml-2">{tag.attributes.posts_count}</span>
          </p>
        </a>
      )
    })

    return <div>{rendered}</div>
  }

  let sidebarStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? '20px' : '0',
  }

  return (
    <div className="row my-5">
      <div className="col-md-3">
        <div className="sidebar" style={sidebarStyle}>
          <h2>Collections</h2>

          {renderTags(tags)}

          <a href="/tags/new" className="new-tag">
            Create new collection
          </a>
        </div>
      </div>

      <div className="col-md-9">
        <h1>Library</h1>
        <hr />

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
    </div>
  )
}
