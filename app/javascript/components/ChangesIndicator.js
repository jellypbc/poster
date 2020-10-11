import React from 'react'
import { formatDistanceToNow } from 'date-fns'

export default function ChangesIndicator({
  isLoading,
  hasUnsavedChanges,
  isNewPost,
  lastSavedAtDate,
}) {
  return (
    <div className={'py-1 px-2 loading-indicator ' + (isLoading && 'active')}>
      <i className="fa fa-circle" />
      <span>
        {isLoading
          ? 'Saving...'
          : hasUnsavedChanges
          ? isNewPost
            ? 'Not saved yet'
            : `Last saved ${formatDistanceToNow(lastSavedAtDate, {
                includeSeconds: true,
                addSuffix: true,
              })}`
          : 'All changes saved'}
      </span>
    </div>
  )
}
