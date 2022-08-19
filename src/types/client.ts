export interface ClientOptions {
  debug: boolean
}

export interface ClientInterface {
  broadcast: (fn: string, params: any) => void
  [fns: string]: any
}
