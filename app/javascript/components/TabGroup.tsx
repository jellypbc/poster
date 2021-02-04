import React from 'react'

interface Tab {
  label: string
  value: string
}

interface Props {
  citationsCount: number
  name: string
  onChange: (any) => void
  option: Array<Tab>
  postsCount: number
  value: string
}

export const TabGroup: React.FC< Props> = (props) => {
  const { 
    value, 
    option, 
    onChange, 
    postsCount, 
    citationsCount
  } = props

  const areaSelected = (tab: Tab) => {
    return value === tab.value ? 'true' : 'false'
  }

  const active = (tab: Tab) => {
    return value === tab.value ? 'active' : ''
  }

  const handleClick = (tab: Tab) => {
    onChange(tab)
  }

  const postCount = (tab: Tab) => {
    return tab.value === '1' ? postsCount : citationsCount
  }

  const tabElements = option.map((tab: Tab) => {
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
