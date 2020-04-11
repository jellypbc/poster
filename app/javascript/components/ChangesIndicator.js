/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

class ChangesIndicator extends React.Component {
  render() {
    const {
      isLoading,
      hasUnsavedChanges,
      isNewPost,
      lastSavedAtDate,
    } = this.props

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
}

export default ChangesIndicator
