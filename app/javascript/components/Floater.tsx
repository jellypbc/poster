import React, { useRef, useEffect, useState } from 'react'

interface Props {
  children: any
  view: any
  menuRef?: {
    current: any
  }
}

export const Floater: React.FC<Props> = (props) => {
  console.log('props floater', props)
  const { view, children } = props
  const [style, setStyle] = useState({ left: 0, top: 0 })

  const menuRef = useRef<any>()

  console.log('menuRef', menuRef)

  useEffect(() => {
    const calculateStyle = (view) => {
      const { selection } = view.state

      const mathNodeIsSelected =
        selection.node &&
        selection.node.type &&
        selection.node.type.name &&
        (selection.node.type.name === 'math_block' ||
          selection.node.type.name === 'math_inline')

      if (!selection || selection.empty || mathNodeIsSelected) {
        return {
          left: -2000,
          top: 0,
        }
      }
      const { offsetWidth, offsetHeight } = menuRef.current
      const anchor = view.coordsAtPos(selection.$anchor.pos)
      const scrollY = window.scrollY

      const top =
        anchor.top - 10 > 0
          ? anchor.top - 110 + scrollY - offsetHeight
          : anchor.top + 20

      let left =
        window.innerWidth - offsetWidth < anchor.left
          ? anchor.left - offsetWidth - 120
          : anchor.left

      if (left < 5) {
        left = 5
      }
      return { left: left, top: top }
    }
    setStyle(calculateStyle(view))
  }, [props, view])

  return (
    <div ref={menuRef} className="floater" style={style}>
      {children}
    </div>
  )
}
