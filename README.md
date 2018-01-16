# Slacklib
> Slack Bot API using TypeScript with rate limiting for NodeJS

*This API surface is incomplete! Feel free to expand the API by contributing.*

## Installation

```sh
npm install slacklib --save
```

## Usage
```ts
import { SlackClient } from 'slacklib'
const bot = new SlackClient({ token: 'xoxc-abcdef-1234567890' })
```

## API

```ts

postMessage(msg: Message): Promise<Chat.Response>
directMessage(user: string, msg: Message): Promise<Chat.Response>

getUser(userId: string): Promise<Users.User>
getUsers(options: ListOptions): Promise<Users.User[]>

getChannel(channelId: string): Promise<Channels.Channel>
getChannels(options: ListOptions): Promise<Channels.Channel[]>

on(event: string, handler: (evt: Events.Event) => void)

// Equivalent to on('message', handler)
onMessage(handler: (msg: Events.Event) => void)

// Equivalent to on('message', evt => { if (evt.type === 'message') { ... } })
onChatMessage(handler: (evt: Events.Message) => void)

```