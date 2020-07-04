import { addAnnotation } from './plugin-comment'

export default {
  comments: {
    addComment: {
      title: 'Add Comment',
      run: addAnnotation,
      content: 'Add Annotation',
    },
  },
}
