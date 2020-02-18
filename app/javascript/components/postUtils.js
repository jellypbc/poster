import { DOMParser, DOMSerializer } from 'prosemirror-model'

export const getTimestamp = (timestampName, post) =>
  (post &&
    post.data &&
    post.data.attributes &&
    post.data.attributes[timestampName]) ||
  null

// determine if post has been saved to the server
// returns `false` if the post was already saved (created)
export const getIsNewPost = post => !getTimestamp('created_at', post)

export const createParser = schema => {
  const parser = DOMParser.fromSchema(schema)

  return content => {
    const container = document.createElement('article')
    container.innerHTML = content

    return parser.parse(container)
  }
}

// TODO: fix me so im not just making weird empty DOM things
export const createSerializer = schema => {
  const serializer = DOMSerializer.fromSchema(schema)

  return doc => {
    const container = document.createElement('article')
    console.log('serializin', doc.content)
    container.appendChild(serializer.serializeFragment(doc.content))

    return container.innerHTML
  }
}
