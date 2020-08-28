// wrap superagent to include csrf token in headers
import superagent from 'superagent'

const token = document.querySelector('[name="csrf-token"]') || {
  content: 'no-csrf-token',
}
const saRequest = superagent.agent().set('X-CSRF-Token', token.content)

export default saRequest
