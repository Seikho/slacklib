import * as db from 'webscaledb'
import * as path from 'path'
import * as fs from 'fs'
import * as process from 'process'

const DB_NAME = path.join(process.cwd(), 'database', 'config.json')

export interface DefaultParams {
  defaultParams: {
    icon_emoji: string
    username: string
    as_user: boolean
  }
}

export interface BaseConfig extends DefaultParams {
  token: string

  name: string
  emoji: string
  channel: string
  timezone: number

  debug: boolean
  log: boolean
}

export function configure<TConfig>() {
  return {
    getter: getConfig<TConfig>(),
    setter: setConfig<TConfig>()
  }
}

function getConfig<TConfig>() {
  const getter = (): TConfig & BaseConfig => {
    const raw = db.get()
    const config = parseConfig<TConfig & BaseConfig>(raw)
    return config
  }
  return getter
}

function parseConfig<TConfig>(rawConfig: db.Config) {
  const cfg = rawConfig as TConfig

  const config = { ...defaultConfig, ...(cfg as any) }
  return {
    ...config,
    defaultParams: {
      icon_emoji: config.emoji,
      username: config.name,
      as_user: false
    }
  } as TConfig
}

function setConfig<TConfig>() {
  const setter = async (key: keyof (TConfig & DefaultConfig), value: any) => {
    const originalValue = db.get(key)
    const parseReqd =
      originalValue !== undefined && typeof originalValue !== 'string' && typeof value === 'string'
    const valueToStore = parseReqd ? JSON.parse(value) : value
    db.set(key, valueToStore)
    await backupAsync()
    const newConfig = parseConfig(db.get())
    return newConfig as TConfig & DefaultConfig
  }

  return setter
}

export async function initialiseConfig(config: any) {
  // If the config file does not exist, create one
  try {
    fs.statSync(DB_NAME)
  } catch (ex) {
    fs.writeFileSync(DB_NAME, '{}')
    await backupAsync({ token: process.env.SLACK_TOKEN || '', ...defaultConfig, ...config })
  }

  const currentConfig = await restoreAsync()
  if (!currentConfig.token) {
    throw new Error('ConfigError: Token is not configured')
  }
  await backupAsync({ ...config, ...currentConfig })
}

export type DefaultConfig = typeof defaultConfig

export const defaultConfig = Object.freeze({
  name: 'SlacklibBot',
  emoji: ':robot_face:',
  channel: 'general',
  timezone: 8,
  debug: false,
  log: false
})

function restoreAsync() {
  return new Promise<db.Config>((resolve, reject) => {
    db.restore(DB_NAME, (err, raw) => {
      if (err) {
        return reject(err)
      }

      return resolve(raw)
    })
  })
}

function backupAsync<TConfig>(cfg?: TConfig) {
  if (cfg) {
    for (const key in cfg) {
      db.set(key, (cfg as any)[key])
    }
  }

  return new Promise<void>(resolve => {
    db.backup(DB_NAME, () => resolve())
  })
}
