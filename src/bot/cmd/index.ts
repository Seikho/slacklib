import { getConfig, Config } from '../config/index'
import { SlackClient } from '../../client'
import { Chat } from '../../types'

export interface CommandListener<TConfig> {
  desc: string
  callback: Callback<TConfig>
}

export type Callback<T> = (
  bot: SlackClient,
  msg: Chat.Message,
  config: T & Config,
  params: string[]
) => void

const listeners: { [command: string]: CommandListener<any> } = {}

export function toRegister<TConfig>() {
  const registerFn = (command: string, description: string, callback: Callback<TConfig>) => {
    internalRegister(command, description, callback as any)
  }

  return registerFn
}

export function internalRegister(command: string, description: string, callback: Callback<{}>) {
  listeners[command] = { desc: description, callback }
}

export async function dispatch(bot: SlackClient, msg: Chat.Message, text: string) {
  const cfg = getConfig()
  const [cmd, ...params] = text.trim().split(' ')
  if (text === '') {
    await dispatch(bot, msg, 'first')
    return
  }

  if (!listeners[cmd]) {
    await bot.postMessage({
      channel: msg.channel,
      text: `Unrecognized command: *${cmd}*. Type @${bot.self.name} help for more information.`,
      ...cfg.defaultParams
    })

    const user = bot.users.find(user => user.id === msg.user)
    console.error(
      `[${user!.name}/${msg.type}/${msg.subtype || 'no subtype'}] Unrecognized command: ${cmd}: ${
        msg.text
      }`
    )
    return
  }

  const user = bot.users.find(user => user.id === msg.user)
  console.log(`User: ${user!.name} | Cmd: ${cmd} | Params: ${params}`)
  listeners[cmd].callback(bot, msg, cfg, params)
}

export function getDescriptions() {
  const commands = Object.keys(listeners).map(key => ({ command: key, desc: listeners[key].desc }))
  return commands
}
