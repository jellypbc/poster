import React, { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { math } from './editor-config/math'
import { useEventListener } from '../utils/eventListener'
import type { IPost } from './types'

interface Props {
  options: {
    doc: any
    schema: any
    setupPlugins: any
  }
  post: IPost
}
export const Sidebar: React.FC<Props> = (props) => {
  const OFFSET = '30'
  const docu = document.getElementById('root')
  let pageHeight = docu != null ? docu.scrollHeight : 0
  const citations: any = document.getElementsByClassName('citations')[0]
  const backlinks: any = document.getElementsByClassName('backlinks')[0]
  if (citations) {
    pageHeight = pageHeight - citations.offsetHeight
  }
  if (backlinks) {
    pageHeight = pageHeight - backlinks.offsetHeight
  }
  const vpHeight = window.innerHeight

  const viewHost: any = useRef()
  const view: any = useRef(null)

  const [portalTop, setPortalTop] = useState<string>('0px')
  const [editorContainerHeight, setEditorContainerHeight] = useState<number>(0)
  const [sidebarEditorTop, setSidebarEditorTop] = useState<number>(0)
  const [portalHeight, setPortalHeight] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(true)
  const [sticky, setSticky] = useState<boolean>(false)
  const [mastheadHeight, setMastheadHeight] = useState<number>(0)

  const calculateEditorPosition = useCallback(
    (sticky, vp, ech) => {
      let calcTop
      if (vp < ech) {
        calcTop = Math.floor((window.scrollY / pageHeight) * -100 - 100)
      } else {
        calcTop = 'auto'
      }
      return sticky ? calcTop : 'auto'
    },
    [pageHeight]
  )

  const reposition = useCallback(
    (vpHeight) => {
      setSticky(window.scrollY >= mastheadHeight ? true : false)

      let ech
      if (viewHost.current) {
        ech = viewHost.current.clientHeight
      }
      setEditorContainerHeight(vpHeight > ech ? ech : vpHeight * 0.8)
      setSidebarEditorTop(calculateEditorPosition(sticky, vpHeight, ech))

      const pHeight = (vpHeight / pageHeight) * ech
      setPortalHeight(pHeight)
    },
    [mastheadHeight, calculateEditorPosition, sticky, pageHeight]
  )

  // initial render
  useEffect(() => {
    view.current = new EditorView(viewHost.current, {
      state: EditorState.create({
        plugins: [math()],
        ...props.options,
      }),
      editable: function (state) {
        return false
      },
    })

    if (viewHost.current) {
      const editorHeight = viewHost.current.clientHeight
      const pHeight = (vpHeight / pageHeight) * editorHeight
      setPortalHeight(pHeight)

      const mh: any = document.getElementsByClassName('masthead')[0]
      if (mh) {
        setMastheadHeight(mh.offsetHeight + mh.offsetTop)
      }
    }
    return () => view.current.destroy()
  }, [pageHeight, props, visible, vpHeight])

  // every render
  useEffect(() => {
    reposition(vpHeight)
  }, [props, vpHeight, sticky, pageHeight, mastheadHeight, reposition])

  // on scroll
  const scrollHandler = useCallback(() => {
    reposition(vpHeight)
    setPortalTop(Math.floor((window.scrollY / pageHeight) * 100) + '%')
  }, [pageHeight, reposition, vpHeight])

  useEventListener('resize', scrollHandler)
  useEventListener('scroll', scrollHandler)

  const clickHandler = (e: any ) => {
    const coord = (eventCoord: any) => {
      return (
        ((eventCoord - Math.floor(portalHeight * 0.5)) /
          editorContainerHeight) *
        pageHeight
      )
    }

    const scrollToCoords = (event) => {
      window.scrollTo({
        left: coord(event.layerX),
        top: coord(event.layerY),
        behavior: 'smooth',
      })
    }

    scrollToCoords(e)
  }
  useEventListener('mousedown', clickHandler, viewHost.current)

  const container = {
    position: 'sticky',
    top: sticky ? OFFSET + 'px' : 'auto',
    height: '100%',
    width: '110px',
  } as React.CSSProperties

  const toggleIconStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? '4px' : '24px',
    outline: 'none',
  } as React.CSSProperties


  const editorContainerStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: '30px',
    height: editorContainerHeight + 'px',
    width: '120px',
    overflow: 'hidden',
  } as React.CSSProperties


  const sidebarEditorStyle = {
    position: 'relative',
    top: sticky ? sidebarEditorTop + 'px' : 'auto',
    display: visible ? 'block' : 'none',
    width: '110px',
    background: 'white',
    transition: 'all 0.15s linear',
  } as React.CSSProperties


  const sidebarPortalStyle = {
    position: 'absolute',
    top: portalTop,
    height: portalHeight + 'px',
    width: '110px',
    zIndex: 33,
    background: 'rgba(0,0,0,0.1)',
    display: visible ? 'block' : 'none',
    cursor: 'move !important',
    transition: 'all 0.2s linear',
    pointerEvents: 'none',
  } as React.CSSProperties


  return (
    <div id="sidebarContainer" style={container}>
      <i
        id="sidebarToggle"
        style={toggleIconStyle}
        className={visible ? 'fa fa-caret-down' : 'fa fa-caret-down rotate'}
        onClick={() => setVisible(!visible)}
        onKeyDown={() => setVisible(!visible)}
        aria-checked={visible}
        role="switch"
        tabIndex={0}
      />

      {visible && (
        <div className="sidebarEditorContainer" style={editorContainerStyle}>
          <div
            id="sidebarEditor"
            ref={viewHost}
            style={sidebarEditorStyle}
            className="animated fadeIn"
          />
          <div className="sidebarPortal" style={sidebarPortalStyle} />
        </div>
      )}
    </div>
  )
}
