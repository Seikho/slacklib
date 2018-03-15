export { setup } from './config/index'
export { readMessage } from './read'
export { start, getBot } from './start'
export * from './cmd'

// Register the built-in config commands
import './cmd/config'
import './cmd/help'
