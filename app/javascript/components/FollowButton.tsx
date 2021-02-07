import React, { useState, useEffect } from 'react'
import { saRequest } from '../utils/saRequest'
import Modal from 'react-modal'

// TODO: add debounce and rate limiter

interface Props {
  currentUser: string
  following: boolean
  objectId: number
  objectType: string
}

export const FollowButton: React.FC<Props> = (props) => {
  const { objectId, objectType, currentUser } = props

  const [following, setFollowing] = useState(props.following || false)
  const [showModal, setShowModal] = useState(false)
  const [, setError] = useState(null)

  Modal.setAppElement('#root')

  useEffect(() => {
    const el = document.querySelector('.hide-follow-button')
    if (el != null && el.parentNode != null) {
      el.parentNode.removeChild(el)
    }
  }, [])

  const followData = () => {
    return {
      user_id: currentUser,
      follow: {
        following_type: objectType,
        following_id: objectId,
      },
    }
  }

  const setFollow = () => {
    if (currentUser) {
      const data = followData()
      const url = '/users/' + objectId + '/follow'

      saRequest
        .post(url)
        .send(data)
        .set('accept', 'application/json')
        .then((res: any) => {
          setFollowing(true)
        })
        .catch((err) => {
          console.log('err.message', err.message)
          setError(err.message)
        })
    }
  }

  const setUnfollow = () => {
    if (currentUser) {
      const data = followData()
      const url = '/users/' + objectId + '/unfollow'

      saRequest
        .post(url)
        .send(data)
        .set('accept', 'application/json')
        .then((res: any) => {
          setFollowing(false)
        })
        .catch((err) => {
          console.log('err.message', err.message)
          setError(err.message)
        })
    }
  }

  const handleClick = (e: any) => {
    if (!currentUser) {
      setShowModal(true)
    } else {
      e.preventDefault()
      e.stopPropagation()
      return following ? setUnfollow() : setFollow()
    }
  }

  let classNames = 'btn btn-primary'
  if (following) {
    classNames += ' following'
  }

  return (
    <div>
      <Modal
        isOpen={showModal}
        className="clear-modal-container"
        // onRequestClose={() => this.setState({ showModal: false })}
        onRequestClose={() => setShowModal(false)}
        shouldCloseOnOverlayClick={true}
      >
        <div className="reg-modal-container animated fadeIn">
          <div className="login-message ">
            <p>You must be logged in to follow this user.</p>
          </div>
        </div>
      </Modal>

      <button
        className={classNames}
        onClick={(e) => handleClick(e)}
        id="followbutton"
      >
        {following && <span></span>}
        {!following && (
          <span>
            <i className="fa fa-user-friends mr-2" />
          </span>
        )}
      </button>
    </div>
  )
}

export default FollowButton