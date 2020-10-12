// An example setup, adapted from prosemirror-example-setup

import { schema, titleSchema } from './schema'
import setupPlugins from './plugins'

export const options = {
  setupPlugins,
  schema,
  // comments: { comments: [] },
}

export const titleOptions = {
  setupPlugins,
  schema,
  // comments: { comments: [] },
}

export { default as menu } from './menu'
export { default as annotationMenu } from './annotation-popup'
export { default as titleMenu } from './title-menu'
