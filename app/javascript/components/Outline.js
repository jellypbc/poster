import React from 'react'
import sanitizeHtml from 'sanitize-html'

export function Outline({ headings, title }) {
  const sanitizedTitle = (html) => {
    let sanitized =
      html !== null
        ? sanitizeHtml(html, {
            allowedTags: ['b', 'sup', 'sub', 'em', 'code'],
            allowedAttributes: {},
          })
        : 'Untitled'
    return { __html: sanitized }
  }

  const outlineItem = (heading) => {
    let className

    if (heading.level === 2) {
      className = 'lv-2'
    } else if (heading.level === 3) {
      className = 'lv-3'
    } else {
      className = 'lv-4'
    }
    console.log('heading', heading)

    return (
      <div
        className={className}
        key={heading.id}
        href={`#${heading.id}`}
        // dangerouslySetInnerHTML={sanitizedTitle(heading.title)}
      >
        <a href={`#${heading.id}`}>{heading.title}</a>
      </div>
    )
  }

  return (
    <div id="sidebarOutline">
      <div
        className="lv-1"
        dangerouslySetInnerHTML={sanitizedTitle(title)}
      ></div>
      {headings.map((heading) => outlineItem(heading))}
    </div>
  )
}
