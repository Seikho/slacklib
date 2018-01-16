import * as Events from './events'
import * as Users from './users'
import * as Chat from './chat'
import * as Channel from './channel'

export type ErrorResponse = {
  ok: false
  error: string
}

export {
  Events,
  Users,
  Chat,
  Channel
}