export type Event =
  | PresenceChange
  | Message
  | UserTyping
  | ReconnectUrl
  | Hello

export type Hello = {
  type: 'hello'
}

export type PresenceChange = {
  type: 'presence_change'

  presence: string
  user: string
}

export type Message = {
  type: 'message'

  user: string
  channel: string
  team: string
  text: string
  ts: string

  event_ts?: string
  source_team?: string
  subtype?: string
}

export type UserTyping = {
  type: 'user_typing'
  channel: string
  user: string
}

export type ReconnectUrl = {
  type: 'reconnect_url',
  url: string
}