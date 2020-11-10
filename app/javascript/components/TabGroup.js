import React from 'react'

export default function TabGroup(props) {
  const { value, option, onChange, postsCount, citationsCount } = props

  const areaSelected = (tab) => {
    return value === tab.value ? 'true' : 'false'
  }

  const active = (tab) => {
    return value === tab.value ? 'active' : ''
  }

  const handleClick = (tab) => {
    onChange(tab)
  }

  const postCount = (tab) => {
    return tab.value === '1' ? postsCount : citationsCount
  }

  const tabElements = option.map((tab) => {
    return (
      <div key={tab.value}>
        <li className="nav-item">
          <a
            id={tab.label + `-tab`}
            className={`nav-link ` + active(tab)}
            data-toggle="tab"
            href={`#` + tab.label}
            aria-controls={tab.label}
            area-selected={areaSelected(tab)}
            onClick={() => handleClick(tab)}
          >
            {tab.label}
            <span className="pill tab-count ml-2">{postCount(tab)}</span>
          </a>
        </li>
      </div>
    )
  })

  return <ul className="nav nav-tabs">{tabElements}</ul>
}
