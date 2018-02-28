import { post } from '../fetch'
import { getUsers } from './list'
import { Users } from '../types'
import { sleep } from '../util'

export async function getUser(userId: string, token: string, knownUsers: Users.User[] = []) {
  const url = `https://slack.com/api/users.info`
  const existingUser = knownUsers.find(user => user.id === userId || user.name === userId)
  if (existingUser) {
    const result = await post<Users.Info>(url, { user: existingUser.id, token })
    return {
      users: knownUsers,
      user: result.user
    }
  }

  const allUsers = await getUsers({}, token)
  const match = allUsers.find(user => user.id === userId || user.name === userId)
  if (!match) {
    return {
      users: allUsers,
      user: undefined
    }
  }

  await sleep(1)
  const result = await post<Users.Info>(`https://slack.com/api/users.info`, {
    user: match.id,
    token
  })

  return {
    users: allUsers,
    user: result.user
  }
}
