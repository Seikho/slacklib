import { getDescriptions } from './'
import { internalRegister } from '../'

internalRegister('help', `View this message`, async (bot, message, config) => {
  const cmds = getDescriptions()
  const response = cmds.map(cmd => `*${cmd.command}*: ${cmd.desc}`).join('\n')
  bot.postMessage({
    channel: message.channel,
    text: response,
    ...config.defaultParams
  })
})
