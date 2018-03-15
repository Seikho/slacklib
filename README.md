# Slacklib
> Slack Bot API using TypeScript with rate limiting for NodeJS

*This API surface is incomplete! Feel free to expand the API by contributing.*

## Installation

```sh
npm install slacklib --save
```

## Usage
```ts
// With command wrappers
import { setup } from 'slacklib'

const bot = setup({ name: 'Bot' })

bot.register('my-command', 'Description', async (bot, msg, cfg, params) => {
  const user = bot.users.find(user => user.id === msg.user)
  await bot.postMessage({ channel: bot.channel, text: `Msg recvd: ${params.join(' ')}`, ...cfg.defaultParams })
  console.log('Message received from ', user!.name)
})

start()

// Without the Bot command wrapper
import { SlackClient } from 'slacklib'
const client = new SlackClient({ token: 'xoxc-abcdef-1234567890' })
```

## API

```ts

postMessage(msg: Message): Promise<Chat.Response>
directMessage(user: string, msg: Message): Promise<Chat.Response>

getUser(userNameOrId: string): Promise<Users.User>
getUsers(options?: ListOptions): Promise<Users.User[]>

getChannel(channelNameOrId: string): Promise<Channels.Channel>
getChannels(options?: ListOptions): Promise<Channels.Channel[]>

on(event: string, handler: (evt: Events.Event) => void)

// Equivalent to on('message', handler)
onMessage(handler: (msg: Events.Event) => void)

// Equivalent to on('message', evt => { if (evt.type === 'message') { ... } })
onChatMessage(handler: (evt: Events.Message) => void)

```