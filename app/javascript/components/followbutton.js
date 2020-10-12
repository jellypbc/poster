import React, { useState, useEffect } from 'react'
import saRequest from '../utils/saRequest'
import Modal from 'react-modal'

// TODO: add debounce and rate limiter
//{ objectId, objectType, following, buttonClass, currentUser }
// export default function FollowButton(props) {
//   const { objectId, objectType, currentUser } = props

//   const [following, setFollowing] = useState(props.following || false)
//   const [showModal, setShowModal] = useState(false)
//   const [error, setError] = useState(null)

//   Modal.setAppElement('#root')

//   useEffect(() => {
//     let el = document.querySelector('.hide-follow-button')
//     el.parentNode.removeChild(el)
//   })

//   const followData = () => {
//     return {
//       user_id: currentUser,
//       follow: {
//         following_type: objectType,
//         following_id: objectId,
//       },
//     }
//   }

//   const setFollow = () => {
//     if (currentUser) {
//       let data = followData()
//       let url = '/users/' + objectId + '/follow'

//       saRequest
//         .post(url)
//         .send(data)
//         .set('accept', 'application/json')
//         .then((res) => {
//           setFollowing(true)
//         })
//         .catch((err) => {
//           console.log('err.message', err.message)
//           setError(err.message)
//         })
//     }
//   }

//   const setUnfollow = () => {
//     if (currentUser) {
//       let data = followData()
//       let url = '/users/' + objectId + '/unfollow'

//       saRequest
//         .post(url)
//         .send(data)
//         .set('accept', 'application/json')
//         .then((res) => {
//           setFollowing(false)
//         })
//         .catch((err) => {
//           console.log('err.message', err.message)
//           setError(err.message)
//         })
//     }
//   }

//   const handleClick = (e) => {
//     if (!currentUser) {
//       setShowModal(true)
//     } else {
//       e.preventDefault()
//       e.stopPropagation()
//       return following ? setUnfollow() : setFollow()
//     }
//   }

//   let classNames = 'btn btn-primary'
//   if (following) {
//     classNames += ' following'
//   }

//   return (
//     <div>
//       <Modal
//         isOpen={showModal}
//         className="clear-modal-container"
//         // onRequestClose={() => this.setState({ showModal: false })}
//         onRequestClose={() => setShowModal(false)}
//         shouldCloseOnOverlayClick={true}
//       >
//         <div className="reg-modal-container animated fadeIn">
//           <div className="login-message ">
//             <p>You must be logged in to follow this user.</p>
//           </div>
//         </div>
//       </Modal>

//       <button
//         className={classNames}
//         onClick={(e) => handleClick(e)}
//         id="followbutton"
//       >
//         {following && <span></span>}
//         {!following && (
//           <span>
//             <i className="fa fa-user-friends mr-2" />
//           </span>
//         )}
//       </button>
//     </div>
//   )
// }

class FollowButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      object_id: this.props.objectId,
      object_type: this.props.objectType,
      following: this.props.following || false,
      showModal: false,
    }
    Modal.setAppElement('#root')
  }

  componentDidMount() {
    var el = document.querySelector('.hide-follow-button')
    console.log('el', el)
    el.parentNode.removeChild(el)
  }

  followData() {
    return {
      user_id: this.props.currentUser,
      follow: {
        following_type: this.state.objectType,
        following_id: this.state.objectId,
      },
    }
  }

  setFollow() {
    if (this.props.currentUser) {
      var data = this.followData()
      var url = '/users/' + this.props.objectId + '/follow'

      saRequest
        .post(url)
        .send(data)
        .set('accept', 'application/json')
        .then((res) => {
          this.setState({ following: true })
        })
        .catch((err) => {
          console.log(err.message)
          this.setState({ error: err.message })
        })
    }
  }

  setUnfollow() {
    if (this.props.currentUser) {
      var data = this.followData()
      var url = '/users/' + this.props.objectId + '/unfollow'

      saRequest
        .post(url)
        .send(data)
        .set('accept', 'application/json')
        .then((res) => {
          this.setState({ following: false })
        })
        .catch((err) => {
          console.log(err.message)
          this.setState({ error: err.message })
        })
    }
  }

  handleClick(e) {
    if (!this.props.currentUser) {
      this.setState({ showModal: true })
    } else {
      e.preventDefault()
      e.stopPropagation()
      return this.state.following ? this.setUnfollow() : this.setFollow()
    }
  }

  render() {
    var classnames = 'btn btn-primary'
    if (this.state.following) {
      classnames += ' following'
    }

    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          className="clear-modal-container"
          onRequestClose={() => this.setState({ showModal: false })}
          shouldCloseOnOverlayClick={true}
        >
          <div className="reg-modal-container animated fadeIn">
            <div className="login-message ">
              <p>You must be logged in to follow this user.</p>
            </div>
          </div>
        </Modal>

        <button
          className={classnames}
          onClick={(e) => this.handleClick(e)}
          id="followbutton"
        >
          {this.state.following && <span></span>}
          {!this.state.following && (
            <span>
              <i className="fa fa-user-friends mr-2" />
            </span>
          )}
        </button>
      </div>
    )
  }
}

export default FollowButton
