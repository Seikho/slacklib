import { post } from '../fetch'
import { Users } from '../types'

export type ListOptions = {
  limit?: number
  presence?: boolean
  cursor?: string
}

export async function getUsers(options: ListOptions, token: string) {
  const result = await post<Users.List>(`https://slack.com/api/users.list`, { ...options, token })

  return result.members
}
