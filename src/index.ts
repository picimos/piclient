import { version } from '../package.json'
import {
  ActionName,
  Actions,
  DynamicActions,
  PiClientBaseDatas,
  PiClientBridgeInterface,
  PiClientCallbackFn,
  PiClientCallbackParams,
  PiClientEventParams,
  PiClientOptions,
  TempCallbackFns,
} from './types'
import {
  CloudrenderIns,
  CloudrenderOptions,
  PiCloudrenderIns,
} from './types/cloudrender'
import { useCloudrender } from './useCloudrender'
import { camelCase, log, logErr } from './utils'

const defaultOptions: PiClientOptions = {
  debug: false,
}

const CLIENT_CALLBACK_NAME = '__PiClientEvent'
const DEFAULT_TARGET = ''

let COUNTER = 0
class PiClient implements PiClientBaseDatas {
  /**
   * 版本号
   */
  readonly _v = version

  private _opts: PiClientOptions = defaultOptions
  private _cbs: TempCallbackFns = {}

  private _connected: boolean = false

  private get _ins(): PiClientBridgeInterface {
    // @ts-ignore
    return window.ue?.interface
  }
  private get _inClient(): boolean {
    return !!this._ins
  }

  //#region 初始化的基础全局数据
  classes: [] = []
  classEvents: object = {}
  actions: [] = []
  globalObjects: [] = []
  worldObjects: [] = []
  private _setBaseDb(param: PiClientCallbackParams) {
    const { params } = param || {}

    this.classes = params.classes
    this.classEvents = params.classEvents
    this.actions = params.actions
    this.globalObjects = params.globalObjects
    this.worldObjects = params.worldObjects
  }
  //#endregion

  private _cloudrenderIns = {} as CloudrenderIns
  protected cloudrender: PiCloudrenderIns = {
    address: '',
    appKey: '',
    $el: undefined,
    enabled: false,
    destroy: () => {
      this.cloudrender.enabled = false

      this._cloudrenderIns.destroy?.()

      this.cloudrender.$el?.firstChild?.remove()
    },
    init: async (options) => {
      if (!options) {
        logErr('Missing [options].')
        return
      }

      const {
        $el,
        address,
        appKey,
        readyCB,
        disconnectCB,
        onProgress,
        report,
        ...projectParam
      } = options

      if (!address || !appKey) {
        logErr('Missing required parameters: address, appKey.')
        return
      }

      this.cloudrender.address = address
      this.cloudrender.appKey = appKey
      this.cloudrender.$el = $el

      options.readyCB = () => {
        this.cloudrender.enabled = true

        this.emit('cloud.init', projectParam, (cbParam) => {
          this._setBaseDb(cbParam)

          readyCB?.(cbParam.params)
        }).catch((msg) => logErr('cloud.init error: ' + msg))
      }

      options.disconnectCB = (msg) => {
        this.cloudrender.destroy()

        disconnectCB?.(msg)
      }

      const ins = useCloudrender(options as CloudrenderOptions)
      await ins.init()

      this._cloudrenderIns = ins

      ins.onMessage((msg) => {
        try {
          const params = JSON.parse(msg as string)
          this.onMessage(params)
        } catch (err) {
          logErr(`onMessage error [${msg}]: `, err)
        }
      })

      return this.cloudrender
    },
  }

  constructor(options: PiClientOptions = defaultOptions) {
    log(`version[${this._v}].`)

    if (!this._inClient) {
      logErr('Not in the client of PiCIMOS.')
    }

    // 合并配置
    this._opts = Object.assign(defaultOptions, options)
  }

  /**
   * 与客户端建立通信
   * @returns 是否连接成功
   */
  connect(): boolean {
    if (!this._inClient) return false

    // 注入回调入口
    // @ts-ignore
    window.ue.interface[CLIENT_CALLBACK_NAME] = (param) =>
      this.onMessage.call(this, param)

    this._connected = true
    return true
  }

  /**
   * 接收客户端通信
   * @param param 客户端回调消息参数
   */
  onMessage(param: PiClientCallbackParams) {
    const { action, target, params } = param || {}
    if (this._opts.debug)
      log(`👉onMessage event[${action}]: ${target || 'unknow target'}`, params)

    const cbs = this._cbs[action]?.[target || DEFAULT_TARGET]

    if (cbs) cbs.forEach((i) => i(param))
  }

  /**
   * 绑定监听事件行为
   * @param action 事件行为名
   * @param target 可选，触发目标对象name
   * @param fn 客户端处理事件行为的回调函数
   */
  on(action: ActionName | string, target: string, fn: PiClientCallbackFn) {
    if (!action || !fn) return

    target = target || DEFAULT_TARGET

    if (!this._cbs[action]) this._cbs[action] = {}

    if (!this._cbs[action]![target]) this._cbs[action]![target] = []

    this._cbs[action]![target].push(fn)
  }

  /**
   * 解绑监听事件行为
   * @param action 事件行为名
   * @param target 触发目标对象name，可选，缺省时解绑对应行为下的所有事件
   */
  off(action: ActionName | string, target?: string) {
    if (!action) return false

    const temp = '$$'
    target = (target ?? temp) || DEFAULT_TARGET
    if (target === temp) {
      return delete this._cbs[action]
    } else if (this._cbs[action]) {
      return delete this._cbs[action]![target!]
    }

    return false
  }

  /**
   * 触发事件行为
   * @param action 事件行为名
   * @param param 输入参数
   * @param callback 事件行为的逻辑回调函数
   * @returns 触发是否成功
   */
  emit<K extends ActionName>(
    action: K,
    param: Actions[K],
    callback?: PiClientCallbackFn,
  ): Promise<PiClientCallbackParams>
  /**
   * 触发动态事件行为
   * @param action 事件行为名
   * @param param 输入参数
   * @param callback 事件行为的逻辑回调函数
   * @returns 触发是否成功
   */
  emit<K extends keyof DynamicActions>(
    action: K,
    param?: DynamicActions[K],
    callback?: PiClientCallbackFn,
  ): Promise<PiClientCallbackParams>
  emit<K extends ActionName>(
    action: K | string,
    param: K extends ActionName ? Actions[K] : DynamicActions[K],
    callback?: PiClientCallbackFn,
  ) {
    // 未在客户端且未开启云渲染
    if (!this._inClient && !this.cloudrender.enabled) {
      logErr('Not in the client of PiCIMOS. Nor cloudrender enabled.')

      return
    }

    const { target, ...params } = param || ({} as any)
    const defaultTarget = target || DEFAULT_TARGET

    if (this._opts.debug)
      log(`👆emit event[${action}]: ${target || 'unknow target'}`, param)

    const j2cParams: PiClientEventParams<ActionName> = {
      action,
      target: defaultTarget,
      params,
    }

    if (callback && typeof callback === 'function') {
      const cbName = camelCase(`${action}.cb${++COUNTER}`)
      j2cParams.callbackAction = cbName

      this.on(cbName, '', (cbParam: PiClientCallbackParams) => {
        this.off(cbName, '')

        callback(cbParam)
      })
    }

    return new Promise((resolve, reject) => {
      this.on(action, defaultTarget, (cbParams) => {
        this.off(action, defaultTarget)

        if (cbParams.success) {
          resolve(cbParams)
        } else {
          reject(cbParams.msg || 'unknown client error.')
        }
      })

      if (!this._inClient && this.cloudrender.enabled)
        this._cloudrenderIns.emit(encodeURIComponent(JSON.stringify(j2cParams)))
      else this._ins.broadcast('', j2cParams)
    })
  }

  /**
   * 页面初始加载完成的调用
   */
  pageReady(): Promise<PiClientBaseDatas> {
    if (!this._connected) this.connect()

    return this.emit('page.loadCompleted').then((param) => {
      this._setBaseDb(param)

      return param.params as PiClientBaseDatas
    })
  }
}

export {
  ActionName,
  PiClient,
  PiClientBaseDatas,
  PiClientCallbackFn,
  PiClientCallbackParams,
  PiClientOptions,
}
