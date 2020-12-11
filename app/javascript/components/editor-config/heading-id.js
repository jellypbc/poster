import { Plugin } from 'prosemirror-state'
import { HeadingView } from '../HeadingView'

export function headingId(options) {
  return new Plugin({
    props: {
      nodeViews: {
        heading: (node, view, getPos) => {
          console.log('i am in here')
          return new HeadingView(node, view, getPos)
        },
      },
    },
  })
}
