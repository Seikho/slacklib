import { post } from '../fetch'
import * as WebSocket from 'ws'
import { EventEmitter } from 'events'
import { Events, Users, Channel, Chat } from '../types'

export interface Response {
  ok: boolean
  url: string

  self: {
    id: string
    name: string
    prefs: any
    created: number
    manual_presence: string
  }

  team: Chat.Team
  users: Users.User[]
  bots: Users.Bot[]
  channels: Channel.Channel[]
  ims: Chat.IM[]
}

export interface ConnectOptions {
  token: string
  batch_presence_aware?: boolean
  presence_sub?: boolean
}

export function wrapSocket(socket: WebSocket, emitter: EventEmitter) {
  let reconnectUrl = ''

  socket.on('message', data => {
    const json: Events.Event = JSON.parse(data.toString())
    if (json.type === 'hello') {
      emitter.emit('connected')
    }

    if (json.type === 'reconnect_url') {
      reconnectUrl = json.url
    }

    if (json.type === 'message' && json.bot_id) {
      json.user = json.bot_id
    }

    emitter.emit('message', json)
  })

  socket.on('open', () => emitter.emit('open'))

  socket.on('close', async () => {
    socket.on('close', () => {
      emitter.emit('close')
    })

    if (!reconnectUrl) {
      emitter.emit('end')
      return
    }

    const nextSocket = new WebSocket(reconnectUrl)
    reconnectUrl = ''
    wrapSocket(nextSocket, emitter)
  })
}

export async function getSlackSocket(options: ConnectOptions, reconnectUrl?: string) {
  const url = reconnectUrl || 'https://slack.com/api/rtm.start'
  const data = await post<Response>(url, options)
  const socket = new WebSocket(data.url)

  return {
    data,
    socket
  }
}
