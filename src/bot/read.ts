import { SlackClient } from '../client'
import { Users, Chat } from '../types'

export interface ReadOptions {
  directOnly?: boolean
  timeout: number
}

// Read a message from the user, and return the text
export function readMessage(
  bot: SlackClient,
  user: Users.User | string,
  options: ReadOptions
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject()
      bot.removeListener('message', callback)
    }, options.timeout * 1000)

    const callback = async (data: Chat.Message) => {
      const isMessage = data.type === 'message'
      if (!isMessage) {
        return
      }

      const channel = data.channel || ''
      const text = (data.text || '').trim()
      const isCorrectChannel = options.directOnly ? channel.startsWith('D') : true

      const isCommand = data.type === 'message' && text.startsWith(`<@${bot.self.id}>`)
      const userId = typeof user === 'string' ? user : user.id
      const isCorrectUser = data.user === userId || data.bot_id === userId

      if (isCorrectChannel && !isCommand && isCorrectUser) {
        bot.removeListener('message', callback)
        resolve(text)
        clearTimeout(timer)
        return
      }
    }

    bot.on('message', callback)
  })
}
