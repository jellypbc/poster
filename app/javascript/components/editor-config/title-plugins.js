import { history } from 'prosemirror-history'
import { commentPlugin, commentUI } from './comments'
import { placeholder } from './placeholder'

import keys from './title-keys'

// export a function here because some plugins need to be bound to a reference
// to a state or view object
const titleSetupPlugins = (getView) => [
  keys,
  placeholder(),
  history(),
  commentPlugin,
  commentUI((transaction) => {
    getView().dispatch(transaction)
  }),
]

export default titleSetupPlugins
