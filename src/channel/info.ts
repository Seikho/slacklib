import { post } from '../fetch'
import { Channel } from '../types'

export async function info(channel: string, token: string, knownChannels: Channel.Channel[]) {
  const existingChannel = knownChannels.find(ch => ch.id === channel || ch.name === channel)
  const result = await post<Channel.Info>(`https://slack.com/api/channels.info`, {
    channel,
    token
  })

  if (existingChannel) {
    return {
      channels: knownChannels
        .filter(ch => ch.id === channel || ch.name === channel)
        .concat([result.channel]),
      channel: result.channel
    }
  }

  return {
    channels: knownChannels.concat([result.channel]),
    channel: result.channel
  }
}
