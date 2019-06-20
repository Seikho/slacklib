import {
  configure,
  initialiseConfig,
  defaultConfig,
  DefaultConfig,
  BaseConfig,
  DefaultParams
} from './setup'
import { toRegister } from '../cmd'

export { BaseConfig as Config, DefaultParams }

export interface SetupConfig extends DefaultConfig {
  token: string
}

export function setup<TConfig extends {}>(
  config: TConfig & Partial<SetupConfig>,
  preventRetrieval: string[] = []
) {
  if (setupCalled) {
    throw new Error('Setup has already been called')
  }

  setupCalled = true
  const { getter, setter } = configure<TConfig>()

  const initialConfig = { ...defaultConfig, ...(config as any) }
  for (const key of Object.keys(initialConfig)) {
    if (key === 'log' || key === 'debug') {
      continue
    }
    setableKeys.add(key)
  }

  // This is async, but we need to return the mutators synchronously
  // Call the isSetup promise resolver to let the app know we are ready to start
  // This is guaranteed to occur on the next tick
  initialiseConfig(initialConfig).then(() => isSetupResolveFn())
  preventRetrieving.push(...preventRetrieval)

  _getter = getter as any
  _setter = setter as any
  const registerFn = toRegister<TConfig>()

  return {
    getConfig: getter,
    setConfig: setter,
    register: registerFn
  }
}

export function getConfig() {
  return _getter()
}

export async function setConfig(key: keyof DefaultConfig, value: any) {
  await untilConfigIsReady()
  return _setter(key, value)
}

let setupCalled = false

let _getter = (): BaseConfig => {
  throw new Error('Configuration not setup')
}

let _setter = (_key: keyof DefaultConfig, _value: any): Promise<BaseConfig> => {
  throw new Error('Configuration not setup')
}

const preventRetrieving: string[] = []

export function getPrivateConfigKeyNames() {
  return preventRetrieving.slice()
}

const setableKeys = new Set<string>()
export function getSetableKeys() {
  return Array.from(setableKeys)
}

// We will resolve this once the configuration has been initialised
let isSetupResolveFn: () => void
const _isSetup = new Promise(resolve => {
  isSetupResolveFn = resolve as any
})

export function untilConfigIsReady() {
  return _isSetup
}
