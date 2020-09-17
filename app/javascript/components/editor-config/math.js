import { Plugin } from 'prosemirror-state'
import MathView from '../MathView'

export default (options) => {
  return new Plugin({
    props: {
      nodeViews: {
        math: (node, view, getPos) => {
          return new MathView(node, view, getPos)
        },
      },
    },
  })
}
