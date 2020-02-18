// An example setup, adapted from prosemirror-example-setup

import schema from './schema'
import setupPlugins from './plugins'

export const options = {
  setupPlugins,
  schema,
  comments: { comments: [] },
}

export { default as menu } from './menu'
