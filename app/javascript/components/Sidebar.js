import React, { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { math } from './editor-config/math'
import { v4 as uuidv4 } from 'uuid'
import { Outline } from './Outline'
import { Minimap } from './Minimap'

function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef()

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener
      if (!isSupported) return

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event)

      // Add event listener
      element.addEventListener(eventName, eventListener)

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    },
    [eventName, element] // Re-run if eventName or element changes
  )
}

export function Sidebar(props) {
  const OFFSET = '30'
  let pageHeight = document.getElementById('root').scrollHeight
  let citations = document.getElementsByClassName('citations')[0]
  let backlinks = document.getElementsByClassName('backlinks')[0]
  if (citations) {
    pageHeight = pageHeight - citations.offsetHeight
  }
  if (backlinks) {
    pageHeight = pageHeight - backlinks.offsetHeight
  }
  const vpHeight = window.innerHeight

  const viewHost = useRef()

  const [portalTop, setPortalTop] = useState('0px')
  const [editorContainerHeight, setEditorContainerHeight] = useState(0)
  const [sidebarEditorTop, setSidebarEditorTop] = useState(0)
  const [portalHeight, setPortalHeight] = useState(0)
  const [visible, setVisible] = useState('none')
  const [sticky, setSticky] = useState(false)
  const [mastheadHeight, setMastheadHeight] = useState(0)

  const [view] = useState(
    new EditorView(viewHost.current, {
      state: EditorState.create({
        plugins: [math()],
        ...props.options,
      }),
      editable: function (state) {
        return false
      },
    })
  )

  const switchVisible = () => {
    if (visible === 'none') {
      setVisible('minimap')
    } else if (visible === 'minimap') {
      setVisible('outline')
    } else {
      setVisible('none')
    }
  }

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

      let pHeight = (vpHeight / pageHeight) * ech
      setPortalHeight(pHeight)
    },
    [mastheadHeight, calculateEditorPosition, sticky, pageHeight]
  )

  const getHeadings = useCallback(() => {
    let headings = []

    view.state.doc.forEach((node) => {
      if (node.type.name === 'heading') {
        const id = uuidv4()
        let name = id

        headings.push({
          title: node.textContent,
          level: node.attrs.level,
          id: name,
        })
      }
    })
    return headings
  })

  // initial render
  useEffect(() => {
    console.log('getHeadings', getHeadings())
    if (viewHost.current) {
      let editorHeight = viewHost.current.clientHeight
      let pHeight = (vpHeight / pageHeight) * editorHeight
      setPortalHeight(pHeight)

      const mh = document.getElementsByClassName('masthead')[0]
      setMastheadHeight(mh.offsetHeight + mh.offsetTop)
    }
    return () => view.destroy()
  }, [getHeadings, pageHeight, view, vpHeight])

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

  const clickHandler = (e) => {
    const coord = (eventCoord) => {
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

  let container = {
    position: 'sticky',
    top: sticky ? OFFSET + 'px' : 'auto',
    height: '100%',
    width: '110px',
  }

  let toggleIconStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? '4px' : '24px',
    paddingTop: '2em', // this needs to be 0 when user has not scrolled past icon
    outline: 'none',
  }

  let editorContainerStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: '30px',
    height: editorContainerHeight + 'px',
    width: '120px',
    overflow: 'hidden',
  }

  let outlineContainerStyle = {
    position: sticky ? 'sticky' : 'relative',
    top: '30px',
    height: editorContainerHeight + 'px',
    width: '120px',
    overflow: 'hidden',
  }

  let sidebarEditorStyle = {
    position: 'relative',
    top: sticky ? sidebarEditorTop + 'px' : 'auto',
    display: visible ? 'block' : 'none',
    width: '110px',
    background: 'white',
    transition: 'all 0.15s linear',
  }

  let sidebarPortalStyle = {
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
  }

  return (
    <div id="sidebarContainer" style={container}>
      <i
        id="sidebarToggle"
        style={toggleIconStyle}
        className={'fas fa-layer-group'}
        onClick={() => switchVisible()}
        onKeyDown={() => switchVisible()}
        aria-checked={visible}
        role="switch"
        tabIndex={0}
      />

      {visible === 'minimap' && <Minimap />}
      {visible === 'outline' && (
        <Outline headings={getHeadings()} title={props.titleOptions} />
      )}
      {visible === 'none' && (
        <div className="sidebarOutlineContainer" style={outlineContainerStyle}>
          none
        </div>
      )}
    </div>
  )
}
