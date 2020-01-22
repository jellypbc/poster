// An example setup, adapted from prosemirror-example-setup

import schema from './schema'
import plugins from './plugins'

export const options = {
	plugins,
	schema,
	comments: { comments: [] },
}

export { default as menu } from './menu'
