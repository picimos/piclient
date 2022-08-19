export interface ActionsOfJ2C {
  /**
   * 进入编辑模式
   * @param {} {modeId: -1, mainPage: -1, subPage: -1}
   */
  'mode.enterEditMode': {}
  /**
   * 进入播放模式
   * @param {} {defaultPageId: ""}
   */
  'mode.enterPlayMode': { defaultPageId?: string }

  /**
   * 移动相机
   * @param {} {offsetX, offsetY}
   */
  'scene.moveCameraByOffset': { offsetX: number; offsetY: number }
  /**
   * 移动相机的开始与结束
   * @param {} {bMoving: boolean}
   */
  'scene.setCanvasMovingState': { bMoving: boolean }

  /**
   * 唤起浏览器打开地址
   * @param {} {url:string}
   */
  'general.openUrl': { url: string }

  /**
   * 事件交互
   * @param {Object} {action,target?,params?}
   * @param {String} action 事件名
   * @param {String} target 可选，目标对象的ID
   * @param {Object} params 可选，参数列表(属性的名和值就是参数的列表)
   */
  'mode.event': { action: string; target?: string; params?: any }

  /**
   * 开启/关闭 webui事件穿透
   * @param {} {enable: boolean}
   */
  'mode.enableTransparency': {}
}

export interface ActionsOfC2J {
  baseDb: {}
  worldObjects: {}
}

/**
 * 自定义行为 与 客户端定义的`baseDb.actions`中的行为
 */
export type ActionName = keyof ActionsOfC2J & string

export interface ParamsOfC2J {
  action: ActionName
  target: string
  params?: any
}

export type ActionFunction = (param: ParamsOfC2J) => void

export type TempCallbackFns = {
  [x in ActionName]?: {
    [target: string]: ActionFunction[]
  }
}
