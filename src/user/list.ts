import { post } from '../fetch'
import { Users } from '../types'

export type ListOptions = {
  token: string
  limit?: number
  presence?: boolean
  cursor?: string
}

export async function getUsers(options: ListOptions) {
  const result = await post<Users.List>(`https://slack.com/api/users.list`, options)

  return result.members
}
