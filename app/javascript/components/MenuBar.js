import React from 'react'
import map from 'lodash/map'
import classnames from 'classnames'

const Button = ({ state, dispatch }) => (item, key) => (
  <button
    key={key}
    type={'button'}
    className={classnames({
      "button": true,
      "active": item.active && item.active(state)
    })}
    title={item.title}
    disabled={item.enable && !item.enable(state)}
    onMouseDown={e => {
      e.preventDefault()
      item.run(state, dispatch)
    }}
  >{item.content}</button>
)

const MenuBar = ({ menu, children, view }) => (
  <div className="bar">
    {children && (
      <span className="group">
        {children}
      </span>
    )}

    {map(menu, (item, key) => (
      <span key={key} className="group">
        {map(item, Button(view))}
      </span>
    ))}
  </div>
)

export default MenuBar
