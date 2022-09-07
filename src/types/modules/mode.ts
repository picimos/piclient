interface ParamOfEnterEditMode {
  /**
   * 模式，0=摆放，1=画刷，2=路线，...
   */
  modeId?: number
  /**
   * 主页面序号 0-7, -1=不修改
   */
  mainPage?: number
  /**
   * 子页面序号, -1=不修改
   */
  subPage?: number
}

interface ParamOfEnterPlayMode {
  /**
   * 默认加载的页面ID
   */
  defaultPageId?: string
}

export interface ModuleModeActions {
  /**
   * 客户端进入编辑模式
   */
  'mode.enterEditMode': ParamOfEnterEditMode
  /**
   * 客户端进入播放模式
   */
  'mode.enterPlayMode': ParamOfEnterPlayMode
}
