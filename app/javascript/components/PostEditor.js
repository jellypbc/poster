/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

import HtmlEditor from './HtmlEditor'
import Floater from './Floater'
import MenuBar from './MenuBar'

import { options, menu } from './config/index'

import superagent from 'superagent'

// returns value of "updated_at" or "created_at" as string, or null
const getTimestamp = (timestampName, post) =>
	(post &&
		post.data &&
		post.data.attributes &&
		post.data.attributes[timestampName]) ||
	null

// determine if post has been saved to the server
// returns `false` if the post was already saved (created)
const getIsNewPost = post => !getTimestamp('created_at', post)

class PostEditor extends React.Component {
	constructor(props) {
		super(props)

		console.log(props) // DEBUG INIT

		// TODO: Whole thing needs to reinit if props.post changes identity,
		//       which can be done with useEffect or componentDidUpdate
		// TODO: should prevent closing tab while hasChanges state is true

		this.state = {
			// don't copy props.post into state unless we expect to update it
			isLoading: false, // is sending request to server
			hasChanges: false, // editor has changes (actual onChange may be debounced)
			error: null, // last server error, if any
			errorAt: null, // string or null
			lastSavedAt: getTimestamp('updated_at', props.post), // string or null
			lastUnsavedChangeAt: null, // Date object or null, used to track dirty state
		}
	}

	handleFormChange(doc) {
		// "doc" is the new HTML

		// do not read from this.state after setState, it will not update until rerender
		this.setState({ isLoading: true })

		var { post } = this.props
		const isNewPost = getIsNewPost(post)

		var url = isNewPost ? '/posts' : post.data.attributes.form_url
		var data = { body: doc }
		var method = isNewPost ? 'post' : 'put'
		var token = document.head.querySelector('[name~=csrf-token][content]')
			.content

		superagent[method](url)
			.send(data)
			.set('X-CSRF-Token', token)
			.set('accept', 'application/json')
			.end((err, res) => {
				console.log({ res, err }) // DEBUG SAVE
				// res is just showing a redirect instead of full data,
				// use the browser timestamp instead of new updated_at
				const now = new Date().toISOString()
				this.setState(state => ({
					isLoading: false,
					error: err ? err : null,
					errorAt: err ? now : null,
					lastSavedAt: err ? state.lastSavedAt : now,
				}))
			})
	}

	render() {
		const { post } = this.props
		const {
			error,
			errorAt,
			isLoading,
			lastSavedAt,
			lastUnsavedChangeAt,
		} = this.state
		const isNewPost = getIsNewPost(post)
		const postBody = post.data.attributes.body
		const lastSavedAtDate = new Date(lastSavedAt) // convert to date object
		const hasUnsavedChanges = lastSavedAtDate < lastUnsavedChangeAt

		return (
			<div>
				{error ? (
					<p className="post__error">
						<strong>{errorAt}</strong>: {error}
					</p>
				) : null}
				<HtmlEditor
					onChange={doc => this.handleFormChange(doc)}
					onHasChanges={() =>
						this.setState({ lastUnsavedChangeAt: new Date() })
					}
					value={postBody}
					options={options}
					autoFocus
					render={({ editor, view }) => (
						<div>
							<Floater view={view}>
								<MenuBar menu={{ marks: menu.marks }} view={view} />
							</Floater>
							<div className="post-editor">
								{editor}
							</div>
						</div>
					)}
				/>

				<div
					className={
						'py-1 px-2 loading-indicator ' + (this.state.loading && 'active')
					}
				>
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
			</div>
		)
	}
}

export default PostEditor
