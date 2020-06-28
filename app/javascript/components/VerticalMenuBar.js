import React from 'react'
import map from 'lodash/map'
import classnames from 'classnames'

const Button = ({ state, dispatch }) => (item, key) => (
  <div>
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
          item.run(state, dispatch)
        }
      }}
    >
      {item.content}
    </button>
  </div>
)

const VertMenuBar = ({ menu, children, view }) => (
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

export default VertMenuBar
