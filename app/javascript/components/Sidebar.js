import React, { useEffect, useRef, useState, useCallback } from "react"
import { EditorView } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

const reactPropsKey = new PluginKey("reactProps")

function useEventListener(eventName, handler, element = window){
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
      const eventListener = event => savedHandler.current(event)

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

  // initial render
  useEffect(() => {
    view.current = new EditorView(viewHost.current, {
      state: EditorState.create({
        ...props.options,
      }),
      editable: function (state) {
        return false
      }.bind(this),
    })

    if (viewHost.current) {
      const vpHeight = window.innerHeight
      const pageHeight = document.getElementById('root').scrollHeight - document.getElementsByClassName('citations')[0].offsetHeight
      let editorHeight = viewHost.current.clientHeight
      let pHeight = (vpHeight / pageHeight) * editorHeight
      setPortalHeight(pHeight)
    }
    return () => view.current.destroy()
  })

  // every render
  useEffect(() => {
    const tr = view.current.state.tr.setMeta(reactPropsKey, props)
    view.current.dispatch(tr)

    // set this scroll trigger to be dynamic
    setSticky( (window.scrollY >= 260) ? true : false )

    let editorHeight
    if (viewHost.current) {
      editorHeight = viewHost.current.clientHeight
    }
    const vpHeight = window.innerHeight
    const pageHeight = document.getElementById('root').scrollHeight -document.getElementsByClassName('citations')[0].offsetHeight

    let calcTop
    if (vpHeight < editorHeight) {
      calcTop = Math.floor(window.scrollY / editorHeight * -100)
    } else {
      calcTop = 'auto'
    }

    let st = (sticky ? calcTop : 'auto')
    setSidebarEditorTop(st)
    setEditorContainerHeight( vpHeight > editorHeight ? editorHeight + 'px' : '80vh' )

  })

  const [portalTop, setPortalTop] = useState('0px')
  const [editorContainerHeight, setEditorContainerHeight] = useState(0)
  const [sidebarEditorTop, setSidebarEditorTop] = useState(0)
  const [portalHeight, setPortalHeight] = useState(0)
  const [visible, setVisible] = useState(true)
  const [sticky, setSticky] = useState(false)

  const handler = useCallback(
    ({sticky}) => { // this order matters
      const vpHeight = window.innerHeight
      const pageHeight = document.getElementById('root').scrollHeight - document.getElementsByClassName('citations')[0].offsetHeight

      // set top position of portal as &
      const scrollPercentage = Math.floor( ( (window.scrollY) / pageHeight) * 100 )
      setPortalTop(scrollPercentage)

      // fetch sidebarHeight
      let ech = viewHost.current.clientHeight
      // if (viewHost.current) setEditorContainerHeight(ech)

      // set portal height based on viewport height
      let pHeight = (vpHeight / pageHeight) * ech
      if (viewHost.current) setPortalHeight(pHeight)
    },
    []
  )
  useEventListener('resize', handler)
  useEventListener('scroll', handler)


  var container = {
    'position': sticky ? 'fixed' : 'relative',
    'top': sticky ? (OFFSET + 'px') : 'auto',
    'width': '110px',
    // 'border': '4px solid pink',
  }

  var editorContainerStyle = {
    // 'border': 'red solid 4px',
    'position': sticky ? 'fixed' : 'relative',
    'height': editorContainerHeight,
    'width': '110px',
    'overflow': 'hidden',
  }

  var sidebarEditorStyle = {
    // 'border': '4px solid green',
    'display': visible ? 'block' : 'none',
    'position': 'absolute',
    'width': '110px',
    'top': sticky ? sidebarEditorTop + 'px' : 'auto',
  }

  var sidebarPortalStyle = {
    // 'border': '4px solid blue',
    'height':  portalHeight + 'px',
    'top': portalTop + '%',
    // 'top':  'calc(' + top + '% - ' + windowHeight + 'px)',
    'width': '110px',
    'zIndex': 33,
    'position': 'relative',
    'background': 'rgba(0,0,0,0.1)',
    'display': visible ? 'block' : 'none',
    'cursor': 'move !important',
  }

  return (
    <div>

      <div
        id="sidebarContainer"
        style={container}
      >
        <i
          id='sidebarToggle'
          className={visible ? "fa fa-caret-right" : "fa fa-caret-right rotate"}
          onClick={() => setVisible(!visible) }
        />

        {visible &&
          <div
            className="sidebarEditorContainer"
            style={editorContainerStyle}
          >
            <div
              id="sidebarEditor"
              ref={viewHost}
              style={sidebarEditorStyle}
              className="animated fadeIn"
            />
            <div
              className="sidebarPortal"
              style={sidebarPortalStyle}
            />
          </div>
        }

      </div>

    </div>
  )

}


export default Sidebar
