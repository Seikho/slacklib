import { post } from '../fetch'

export async function identity(token: string) {
  return post(`https://slack.com/api/users.identity`, { token })
}
