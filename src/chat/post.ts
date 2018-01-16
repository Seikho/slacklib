import { post } from '../fetch'
import { Chat } from '../types'

export default function postMessage(chat: Chat.PostMessage, token: string) {
  const attachments = JSON.stringify(chat.attachments || [])
  const options = {
    as_user: true,
    ...chat,
    attachments
  }
  return post<Chat.Response>(`https://slack.com/api/chat.postMessage`, { ...options, token })
}
