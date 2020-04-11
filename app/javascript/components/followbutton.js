import React from 'react'
import superagent from 'superagent'
import Modal from 'react-modal'

// TODO: add debounce and rate limiter
class FollowButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      object_id: this.props.object_id,
      object_type: this.props.object_type,
      following: this.props.following || false,
      showModal: false,
    }
    Modal.setAppElement('#root')
  }

  componentDidMount() {
    var el = document.querySelector('.hide-follow-button')
    el.parentNode.removeChild(el)
  }

  followData() {
    return {
      user_id: this.props.current_user,
      follow: {
        following_type: this.state.object_type,
        following_id: this.state.object_id,
      },
    }
  }

  setFollow() {
    const token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    if (this.props.current_user) {
      var data = this.followData()
      var url = '/users/' + this.props.object_id + '/follow'

      superagent
        .post(url)
        .send(data)
        .set('X-CSRF-Token', token)
        .set('accept', 'application/json')
        .then(res => {
          this.setState({ following: true })
        })
        .catch(err => {
          console.log(err.message)
          this.setState({ error: err.message })
        })
    }
  }

  setUnfollow() {
    const token = document.head.querySelector('[name~=csrf-token][content]')
      .content

    if (this.props.current_user) {
      var data = this.followData()
      var url = '/users/' + this.props.object_id + '/unfollow'

      superagent
        .post(url)
        .send(data)
        .set('X-CSRF-Token', token)
        .set('accept', 'application/json')
        .then(res => {
          this.setState({ following: false })
        })
        .catch(err => {
          console.log(err.message)
          this.setState({ error: err.message })
        })
    }
  }

  handleClick(e) {
    if (!this.props.current_user) {
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
          onClick={e => this.handleClick(e)}
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
