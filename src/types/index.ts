import { ActionName, Actions } from './modules'

export interface PiClientBridgeInterface {
  broadcast: (fn: string, params: PiClientEventParams<ActionName>) => void
  [fn: string]: any
}

/**
 * 客户端基础全局数据
 */
export interface PiClientBaseDatas {
  /**
   * 客户端支持的所有场景对象的类型
   */
  classes: []
  /**
   * 客户端定义的类的事件集
   */
  classEvents: object
  /**
   * 客户端支持的事件触发行为集
   */
  actions: []
  /**
   * 客户端全局对象
   */
  globalObjects: []
  /**
   * 客户端场景对象
   */
  worldObjects: []
}

export interface PiClientOptions {
  debug?: boolean
}

/**
 * 客户端事件触发参数
 */
export interface PiClientEventParams<K extends ActionName> {
  /**
   * 事件行为名
   */
  action: K | string
  /**
   * 目标对象name
   */
  target?: string
  /**
   * 逻辑回调函数名
   */
  callbackAction?: string
  /**
   * 输入参数
   */
  params?: Actions[K] | any
}

/**
 * 客户端回调消息参数
 */
export interface PiClientCallbackParams {
  /**
   * 事件行为名
   */
  action: string
  /**
   * 目标对象name
   */
  target?: string
  /**
   * 输出参数
   */
  params?: any

  /**
   * 是否成功
   */
  success?: boolean
  /**
   * 失败时的信息
   */
  msg?: string
}

/**
 * 客户端回调函数
 */
export type PiClientCallbackFn = (param: PiClientCallbackParams) => void

export interface TempCallbackFns {
  [action: string]: {
    [target: string]: any[]
  }
}

export * from './modules'
export * from './cloudrender'
