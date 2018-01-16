export type Purpose = {
  value: string
  creator: string
  last_set: number
}

export type Topic = {
  value: string
  creator: string
  last_set: number
}

export type Info = {
  ok: true
  channel: Channel
}

export type Channel = {
  id: string
  name: string
  creator: string
  is_archived: boolean
  is_general: boolean
  is_member: boolean
  is_starred: boolean
  members?: string[]
  topic: Topic
  purpose: Purpose
  last_read: string
  latest: any // Not currently known
  unread_count: number
  unread_count_display: number
}

export type List = {
  ok: true
  channels: Array<Pick<Info, 'channel'>>
}
