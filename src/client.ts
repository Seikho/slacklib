import { getSlackSocket, wrapSocket, Response } from './real-time/connect'
import { EventEmitter } from 'events'
import * as WebSocket from 'ws'
import { Events, Chat, Users, Channel } from './types'
import * as user from './user'
import * as chat from './chat'
import * as channels from './channel'

export interface Options {
  token: string
  batch_presence_aware?: boolean
  presence_sub?: boolean
}

export class SlackClient extends EventEmitter {
  socket: WebSocket = null as any
  self: Response['self'] = null as any
  team: Chat.Team = null as any

  users: Users.User[] = []
  channels: Channel.Channel[] = []
  ims: Chat.IM[] = []

  private token: string

  constructor(private options: Options) {
    super()
    this.on('end', () => this.connect())
    this.connect()
    this.token = options.token
  }

  async connect() {
    const { socket, data } = await getSlackSocket(this.options)

    this.socket = socket
    this.self = data.self
    this.channels = data.channels
    this.users = data.users
    this.team = data.team
    this.ims = data.ims

    wrapSocket(socket, this)
  }

  postMessage = (message: Chat.PostMessage) => chat.post(message, this.token)
  directMessage = async (user: string, msg: Chat.PostMessage) => {
    const { ims, users, result } = await chat.directMessage(
      user,
      msg,
      this.token,
      this.users,
      this.ims
    )
    this.ims = ims
    this.users = users
    return result
  }

  interact = (interaction: Chat.Interaction) => chat.interact(interaction, this.token)

  getUser = async (userId: string) => {
    const result = await user.getUser(userId, this.token, this.users)
    this.users = result.users
    return result.user
  }

  getUsers = async (options: user.ListOptions = {}) => {
    const result = await user.getUsers(options, this.token)
    this.users = result
    return result
  }

  getChannel = async (channelId: string) => {
    const result = await channels.info(channelId, this.token, this.channels)
    this.channels = result.channels
    return result.channel
  }

  getChannels = async (options: channels.ListOptions = {}) => {
    const result = await channels.list(options, this.token)
    this.channels = result
    return result
  }

  onMessage(handler: (msg: Events.Event) => void) {
    this.on('message', handler)
  }

  onChatMessage(handler: (msg: Events.Message) => void) {
    this.on('message', (event: Events.Event) => {
      if (event.type === 'message') {
        handler(event)
      }
    })
  }
}
