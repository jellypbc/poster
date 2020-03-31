import { addAnnotation } from './plugin-comment'
import icons from './icons'

export default {
  comments: {
    addComment: {
      title: 'Add Comment',
      run: addAnnotation,
      content: "Add Annotation",
    },
  },
}
