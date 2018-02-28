import { post } from '../fetch'
import { Channel } from '../types'

export type ListOptions = {
  excludeArchived?: boolean
  excludeMembers?: boolean
}

export async function list(options: ListOptions, token: string) {
  const archived = typeof options.excludeArchived === 'undefined' ? true : options.excludeArchived
  const members = typeof options.excludeMembers === 'undefined' ? true : options.excludeMembers

  const result = await post<Channel.List>(`https://slack.com/api/channels.list`, {
    exclude_archived: archived,
    exclude_members: members,
    token
  })

  return result.channels
}
