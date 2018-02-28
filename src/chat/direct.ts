import { post } from '../fetch'
import { Chat, Users } from '../types'
import { getUsers } from '../user/list'
import { sleep } from '../util'

export async function directMessage(
  user: string,
  chat: Chat.PostMessage,
  token: string,
  users: Users.User[],
  ims: Chat.IM[]
) {
  const info = await getIM(user, users, ims, token)
  if (!info.im) {
    return {
      users: info.users,
      ims: info.ims,
      result: undefined
    }
  }

  const attachments = JSON.stringify(chat.attachments || [])
  const options = {
    ...chat,
    channel: info.im.id,
    attachments
  }

  const result = await post<Chat.Response>(`https://slack.com/api/chat.postMessage`, {
    ...options,
    token
  })

  return {
    users: info.users,
    ims: info.ims,
    result
  }
}

async function getIM(userId: string, users: Users.User[], ims: Chat.IM[], token: string) {
  const existing = ims.find(im => !!im && im.user === userId)
  if (existing) {
    return {
      im: existing,
      ims,
      users
    }
  }

  const user = users.find(user => user.name === userId || user.id === userId)
  if (!user) {
    const allUsers = await getUsers({}, token)
    await sleep(1)
    const user = users.find(user => user.name === userId || user.id === userId)
    if (!user) {
      return {
        users: allUsers,
        ims,
        im: undefined
      }
    }

    const result = await post<{ ok: boolean; im: Chat.IM }>(`https://slack.com/api/im.open`, {
      token,
      user: user.id,
      return_im: true
    })

    return {
      users: allUsers,
      im: result.im,
      ims: [...ims, result.im]
    }
  }

  const result = await post<{ ok: boolean; im: Chat.IM }>(`https://slack.com/api/im.open`, {
    token,
    user: user.id,
    return_im: true
  })

  return {
    users,
    im: result.im,
    ims: [...ims, result.im]
  }
}
