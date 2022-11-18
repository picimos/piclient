import { Listener, Disposable } from 'ray-streaming/types/utils/typed-event'
import { PiClientBaseDatas } from '.'
import { ParamOfCloudInit } from './modules/cloud'

interface CloudrenderReport {
  fps: number
  latency: number
  bitrate: number
  packetLossRate: number
  averageJitterBufferDelay: number
  framesReceived: number
  framesDecoded: number
  keyFramesDecoded: number
  framesDropped: number
}

export interface CloudrenderIns {
  init(): Promise<void>
  /**
   * 销毁云渲染实例
   */
  destroy(): void
  emit(msg: string): Promise<boolean>
  onMessage(listener: Listener<string | ArrayBuffer>): Disposable
}

export type DisconnectMsg = '连接中断' | '信令断开' | '超时断开'

export interface CloudrenderOptions {
  /**
   * 云渲染服务的连接地址
   */
  address: string
  /**
   * 云渲染服务的appKey
   */
  appKey: string
  /**
   * 挂载的元素
   */
  $el?: HTMLElement
  /**
   * 云渲染准备完成的回调
   */
  readyCB?(): void | Promise<any>
  /**
   * 云渲染断开连接的回调
   * @param msg 连接断开的说明
   */
  disconnectCB?(msg: DisconnectMsg): void
  /**
   * 监听云渲染连接进度
   * @param percent 进度值, 0-100
   */
  onProgress?(percent: number): void

  /**
   * 实时连接状态反馈
   * @param state `CloudrenderReport`
   */
  report?(state: CloudrenderReport): void
}

/**
 * 云渲染初始化配置
 */
export interface PiCloudrenderOptions
  extends Omit<CloudrenderOptions, 'readyCB' | 'disconnectCB'>,
    ParamOfCloudInit {}

export interface PiCloudrenderIns
  extends Pick<CloudrenderOptions, 'address' | 'appKey' | '$el'>,
    Pick<CloudrenderIns, 'destroy'> {
  /**
   * 是否已启用云渲染
   */
  enabled: boolean
  /**
   * 初始化云渲染
   * @param options 云渲染参数及初始项目参数
   */
  init(options: PiCloudrenderOptions): Promise<PiClientBaseDatas | undefined>
}
