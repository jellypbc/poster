// An example setup, adapted from prosemirror-example-setup

import { schema, titleSchema } from './schema'
import setupPlugins from './plugins'

export const options = {
  setupPlugins,
  schema,
  comments: { comments: [] },
}

export const titleOptions = {
  setupPlugins,
  titleSchema,
  comments: { comments: [] },
}

export { default as menu } from './menu'
export { default as annotationMenu } from './annotation-popup'
export { default as titleMenu } from './title-menu'
export { default as menu2 } from './menu2'
