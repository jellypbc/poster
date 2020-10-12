import React from 'react'
import map from 'lodash/map'
import classnames from 'classnames'

export default function MenuBar({ menu, children, view }) {
  return (
    <div>
      <div className="bar">
        {children && <span className="group">{children}</span>}

        {map(menu, (item, key) => (
          <span key={key} className="group">
            {map(item, Button(view))}
          </span>
        ))}
      </div>
    </div>
  )
}

// const Button = ({ state, view, dispatch }) => (item, key) => (
const Button = (view) => (item, key) => {
  let { state, dispatch } = view
  return (
    <button
      key={key}
      className={classnames({
        button: true,
        active: item.active && item.active(state),
      })}
      id={item.id}
      title={item.title}
      disabled={item.enable && !item.enable(state)}
      onMouseDown={(e) => {
        if (item.run) {
          e.preventDefault()
          item.run(state, dispatch, view)
        }
      }}
    >
      {item.content}
    </button>
  )
}
