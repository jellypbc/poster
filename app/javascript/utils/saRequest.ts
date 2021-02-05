// wrap superagent to include csrf token in headers
import superagent from 'superagent'

const token: any = document.querySelector('[name="csrf-token"]') || {
  content: 'no-csrf-token',
}

export const saRequest = superagent.agent().set('X-CSRF-Token', token.content)
