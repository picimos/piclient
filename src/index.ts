import { version } from '../package.json'
import {
  ClientInterface,
  ClientOptions,
  ActionsOfJ2C,
  ParamsOfC2J,
  ActionName,
  TempCallbackFns,
  ActionFunction,
} from './types'
export { ClientInterface, ClientOptions }

function log(msg: string, ...args: any[]) {
  const $c = window.console
  $c.log(`%c [PiClientJS] ${msg}`, 'color:#eb906e', ...args)
}

const CLIENT_CALLBACK_NAME = 'piClientEvent'

const defaultOptions: ClientOptions = {
  debug: false,
}

export class PiClient {
  readonly _v = version
  private _ins: ClientInterface
  private _opts: ClientOptions = defaultOptions
  private _cbs: TempCallbackFns

  /**
   * 客户端支持的所有场景对象的类型
   */
  classes: [] = []
  /**
   * 客户端定义的类的行为事件
   */
  classEvents: object = {}
  /**
   * 客户端支持的行为
   */
  actions: [] = []
  /**
   * 客户端全局对象
   */
  globalObjects: [] = []
  /**
   * 客户端场景对象
   */
  worldObjects: [] = []

  constructor(options: ClientOptions = defaultOptions) {
    // @ts-ignore
    this._ins = window.ue?.interface

    if (!this._ins) {
      this._ins = {
        broadcast(fn, params) {
          log(`fix j2c event[${fn}]`, params)
        },
      }

      throw new Error('Not in client of the PiCIMOS.')
    }

    log(`version[${this._v}].`)

    this.trigger = this.j2c

    // 合并配置
    this._opts = Object.assign(defaultOptions, options)

    // 注入回调入口
    this._ins[CLIENT_CALLBACK_NAME] = this.c2J

    this._cbs = [] as TempCallbackFns
  }

  private j2c<K extends keyof ActionsOfJ2C>(fn: K, params?: ActionsOfJ2C[K]) {
    if (this._opts.debug) log(`j2c event[${fn}]`, params)

    this._ins.broadcast(fn, JSON.stringify(params))
  }
  private c2J(param: ParamsOfC2J) {
    const { action, target, params } = param || {}

    if (this._opts.debug) log(`c2j event[${action}]`, target, params)

    const cbs = this._cbs[action]?.[target]

    if (cbs) cbs.forEach((i) => i(param))
  }

  /**
   * 触发客户端事件
   * @param fn 事件名
   * @param params 参数
   */
  trigger

  /**
   * 监听行为事件
   * @param action 行为名
   * @param target 行为目标
   * @param fn 绑定的函数
   */
  on(action: ActionName, target: string, fn: ActionFunction) {
    if (!action || !fn) return

    if (!this._cbs[action]) this._cbs[action] = {}

    if (!this._cbs[action]![target]) this._cbs[action]![target] = []

    this._cbs[action]![target].push(fn)
  }

  /**
   * 解绑监听事件
   * @param action 行为名
   * @param target 行为目标，可选，缺省时解绑行为下的所有事件
   */
  off(action: ActionName, target?: string) {
    if (!action) return false

    if (!target) {
      return delete this._cbs[action]
    } else if (this._cbs[action]) {
      return delete this._cbs[action]![target!]
    }

    return false
  }

  pageReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.on('baseDb', 'world', ({ params }: ParamsOfC2J) => {
        this.classes = params.classes
        this.classEvents = params.classEvents
        this.actions = params.actions
        this.globalObjects = params.globalObjects

        resolve()
      })
      this.on('worldObjects', 'world', ({ params }: ParamsOfC2J) => {
        this.worldObjects = params.objects
      })

      this.j2c('mode.event', { action: 'page.loadCompleted' })
    })
  }
}
