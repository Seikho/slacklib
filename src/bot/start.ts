import { getConfig, untilConfigIsReady } from './config'
import { dispatch } from './cmd'
import { SlackClient } from '../client'
import { Chat } from '../types'

let _bot: any = null
let botResolveFn: Function
let botReady = new Promise(resolve => (botResolveFn = resolve))

export async function start(): Promise<SlackClient> {
  if (_bot) {
    return _bot
  }

  await untilConfigIsReady()
  const config = getConfig()
  const bot = new SlackClient({ token: config.token })
  try {
    await waitTilReady(bot)
  } catch (ex) {
    console.error('Failed to connect to Slack. Retrying in 3 seconds...')
    return new Promise<SlackClient>(resolve => {
      setTimeout(() => resolve(start()), 3000)
    })
  }

  listenForCommands(bot)

  bot.on('error', (err: any) => console.error(`SlackError: ${err.message || err}`))
  bot.setMaxListeners(Infinity)

  _bot = bot
  botResolveFn()
  return _bot
}

export async function getBot(): Promise<SlackClient> {
  await botReady
  return _bot
}

function listenForCommands(bot: SlackClient) {
  const id = `<@${bot.self.id}>`

  bot.on('message', (data: Chat.Message) => {
    if (!data.text) {
      return
    }

    if (data.subtype === 'channel_join') {
      return
    }

    const text = data.text.trim()
    if (!text.startsWith(id)) {
      return
    }

    dispatch(bot, data, text.replace(id, ''))
  })
}

function waitTilReady(bot: SlackClient) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(), 5000)
    const cb = (_: any) => {
      console.log('Successfully connected')
      clearTimeout(timer)
      resolve()
    }

    bot.on('connected', cb)
  })
}
