import { schema } from './schema'
import { setupPlugins, titleSetupPlugins } from './plugins'

export const options = {
  setupPlugins: setupPlugins,
  schema,
  // comments: { comments: [] },
}

export const titleOptions = {
  setupPlugins: titleSetupPlugins,
  schema,
  // comments: { comments: [] },
}

export { default as menu } from './menu'
export { default as annotationMenu } from './annotation-popup'
export { default as titleMenu } from './title-menu'
