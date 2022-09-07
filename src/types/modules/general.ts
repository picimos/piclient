interface ParamOfOpenUrl {
  url: string
}

export interface ModuleGeneralActions {
  /**
   * 唤起浏览器打开网页
   */
  'general.openUrl': ParamOfOpenUrl
  /**
   * 网页准备就绪通知
   */
  'page.loadCompleted': any
}
