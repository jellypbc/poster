import { schema } from './schema'
import { bodyPlugins, titlePlugins } from './plugins'

export const bodyOptions = {
  setupPlugins: bodyPlugins,
  schema,
}

export const titleOptions = {
  setupPlugins: titlePlugins,
  schema,
}

export { default as menu } from './menu'
export { default as annotationMenu } from './annotation-popup'
export { default as titleMenu } from './title-menu'
