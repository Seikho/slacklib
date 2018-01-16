import { post } from '../fetch'
import { Channel } from '../types'

export async function info(channel: string, token: string) {
  const result = await post<Channel.Info>(`https://slack.com/api/channels.info`, {
    channel,
    token
  })

  return result.channel
}
