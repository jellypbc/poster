import React, { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

const reactPropsKey = new PluginKey('reactProps')

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

function reactProps(initialProps) {
  return new Plugin({
    key: reactPropsKey,
    state: {
      init: () => initialProps,
      apply: (tr, prev) => tr.getMeta(reactPropsKey) || prev,
    },
  })
}

function Sidebar(props) {
  const OFFSET = '30'
  const viewHost = useRef()
  const view = useRef(null)
  const { post } = props

  const [portalTop, setPortalTop] = useState('0px')
  const [editorContainerHeight, setEditorContainerHeight] = useState(0)
  const [sidebarEditorTop, setSidebarEditorTop] = useState(0)
  const [portalHeight, setPortalHeight] = useState(0)
  const [visible, setVisible] = useState(true)
  const [sticky, setSticky] = useState(false)

  // initial render
  useEffect(() => {
    view.current = new EditorView(viewHost.current, {
      state: EditorState.create({
        ...props.options,
      }),
      editable: function (state) {
        return false
      },
    })

    // if (viewHost.current) {
    //   const vpHeight = window.innerHeight
    //   const pageHeight = document.getElementById('root').scrollHeight - document.getElementsByClassName('citations')[0].offsetHeight
    //   let editorHeight = viewHost.current.clientHeight
    //   let pHeight = (vpHeight / pageHeight) * editorHeight
    //   setPortalHeight(pHeight)
    // }
    return () => view.current.destroy()
  }, [props, visible])

  // every render
  useEffect(() => {
    const vpHeight = window.innerHeight
    const pageHeight =
      document.getElementById('root').scrollHeight -
      document.getElementsByClassName('citations')[0].offsetHeight

    const tr = view.current.state.tr.setMeta(reactPropsKey, props)
    view.current.dispatch(tr)

    // set this scroll trigger to be dynamic based on masthead height
    const mh = document.getElementsByClassName('masthead')[0]
    const mastheadHeight = mh.offsetHeight + mh.offsetTop
    setSticky(window.scrollY >= mastheadHeight ? true : false)

    // sets the editor container height for smaller than page length viewports
    let ech
    if (viewHost.current) {
      ech = viewHost.current.clientHeight
    }
    setEditorContainerHeight(vpHeight > ech ? ech + 'px' : vpHeight * 0.8)

    // sets the portal position
    let calcTop
    if (vpHeight < ech) {
      calcTop = Math.floor((window.scrollY / ech) * -100)
    } else {
      calcTop = 'auto'
    }

    let st = sticky ? calcTop : 'auto'
    setSidebarEditorTop(st)

    let pHeight = (vpHeight / pageHeight) * ech
    setPortalHeight(pHeight)
  }, [props, sticky])

  // on scroll
  const scrollHandler = useCallback(
    ({}) => {
      // this order matters
      const vpHeight = window.innerHeight
      const pageHeight =
        document.getElementById('root').scrollHeight -
        document.getElementsByClassName('citations')[0].offsetHeight

      // set top position of portal as &
      const scrollPercentage = Math.floor((window.scrollY / pageHeight) * 100)
      setPortalTop(scrollPercentage + '%')

      // fetch sidebarHeight
      let ech = viewHost.current.clientHeight
      if (viewHost.current) setEditorContainerHeight(ech)

      // set portal height based on viewport height
      let pHeight = (vpHeight / pageHeight) * editorContainerHeight
      if (viewHost.current) setPortalHeight(pHeight)
    },
    [editorContainerHeight]
  )
  useEventListener('resize', scrollHandler)
  useEventListener('scroll', scrollHandler)

  var container = {
    position: 'sticky',
    top: sticky ? OFFSET + 'px' : 'auto',
    width: '110px',
    height: '100%',
  }

  var toggleIconStyle = {
    top: sticky ? '4px' : '24px',
    position: sticky ? 'sticky' : 'relative',
  }

  var editorContainerStyle = {
    position: sticky ? 'sticky' : 'relative',
    height: editorContainerHeight,
    top: '30px',
    width: '120px',
    overflow: 'hidden',
  }

  var sidebarEditorStyle = {
    display: visible ? 'block' : 'none',
    position: 'relative',
    width: '110px',
    top: sticky ? sidebarEditorTop + 'px' : 'auto',
    background: 'white',
    transition: 'all 0.15s linear',
  }

  var sidebarPortalStyle = {
    height: portalHeight + 'px',
    top: portalTop,
    width: '110px',
    zIndex: 33,
    position: 'absolute',
    background: 'rgba(0,0,0,0.1)',
    display: visible ? 'block' : 'none',
    cursor: 'move !important',
    transition: 'all 0.15s linear',
  }

  return (
    <div id="sidebarContainer" style={container}>
      <i
        id="sidebarToggle"
        style={toggleIconStyle}
        className={visible ? 'fa fa-caret-right' : 'fa fa-caret-right rotate'}
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

export default Sidebar
