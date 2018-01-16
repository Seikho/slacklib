import { post } from '../fetch'
import { Chat } from '../types'

export default async function interact(interaction: Chat.Interaction, token: string) {
  const result = await post(`https://slack.com/api/chat.postMessage`, { ...interaction, token })

  return result
}
