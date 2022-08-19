import { ActionsOfJ2C } from './actions'

export interface ClientOptions {
  debug: boolean
}

export interface ClientInterface {
  broadcast: (fn: keyof ActionsOfJ2C, params: any) => void
  [fns: string]: any
}
