export type Info = {
  ok: boolean
  user: User
}

export type User = {
  id: string
  name: string
  deleted: boolean
  color: string
  profile: {
    avatar_hash: string
    current_status: string
    first_name: string
    last_name: string
    real_name: string
    tz: string
    tz_label: string
    tz_offset: number
    email: string
    skype: string
    phone: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
  }
  is_admin: boolean
  is_owner: boolean
  updated: number
  has_2fa: boolean
  real_name: string
}

export type List = {
  ok: boolean
  members: User[]
  cache_ts: number
  response_metadata: {
    next_cursor?: string
  }
}
