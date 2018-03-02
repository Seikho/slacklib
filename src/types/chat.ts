export interface Message {
  type: 'message'
  subtype?: string
  bot_id?: string
  username?: string
  user: string
  channel: string
  text: string
  ts: number
  source_team: string
  team: string
}

export type PostPrivateMessage = {
  text?: string

  as_user?: boolean
  attachments?: Attachment[]
  icon_emoji?: string
  icon_url?: string
  link_names?: boolean
  reply_broadcast?: boolean
  thread_ts?: number | string
  unurl_links?: boolean
  unfurl_meadia?: boolean
  username?: string
  mrkdwn?: boolean
}

export type PostMessage = {
  channel: string
  text?: string

  as_user?: boolean
  attachments?: Attachment[]
  icon_emoji?: string
  icon_url?: string
  link_names?: boolean
  reply_broadcast?: boolean
  thread_ts?: number | string
  unurl_links?: boolean
  unfurl_meadia?: boolean
  username?: string
  mrkdwn?: boolean
}

export type Response = {
  ok: boolean
  channel: string
  ts: string
  message: {
    text: string
    username: string
    bot_id?: string
    attachments: Attachment[]
    type: 'message'
    subtype?: string
    ts: string
  }
}

export type Interaction = {
  channel: string
  text?: string
  attachments?: InteractionAttachment[]
  response_type?: 'in_channel' | 'ephemeral'
  thread_ts?: string
  replace_original?: boolean
  delete_original?: boolean
}

export type InteractionAttachment = {
  callback_id: string
  fallback: string
  title?: string
  color?: string
  attachment_type?: string
  actions: AttachmentAction[]
}

export type Attachment = {
  title?: string
  pretext?: string
  text?: string
  mrkdwn_in?: Array<'text' | 'pretext'>
  color?: string
  author_name?: string
  author_link?: string
  title_link?: string
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string
  ts?: number
  fields?: Array<{ title: string; value: string; short: boolean }>
}

export type AttachmentAction = {
  name: string
  text: string
  value?: string
  type: 'button' | 'select'
  style?: 'default' | 'primary' | 'danger'
  confirm?: {
    title?: string
    text: string
    ok_text?: string
    dismiss_text?: string
  }
}

export type IM = {
  id: string
  created: number
  has_pins: boolean
  is_im: boolean
  is_open: boolean
  is_org_shared: boolean
  last_read: string
  priority: number
  user: string
}

export type Team = {
  avatar_base_url: string
  domain: string
  email_domain: string
  icon: any
  id: string
  messages_count: number
  msg_edit_windows_mins: number
  name: string
  over_storage_limit: boolean
  plan: string
  token: string
}
