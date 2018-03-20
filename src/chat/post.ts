import { post } from '../fetch'
import { Chat } from '../types'
import { queue } from '../queue'

export default function postMessage(chat: Chat.PostMessage, token: string) {
  const attachments = JSON.stringify(chat.attachments || [])
  const options = {
    as_user: true,
    ...chat,
    attachments
  }

  return queue(() =>
    post<Chat.Response>(`https://slack.com/api/chat.postMessage`, { ...options, token })
  )
}
