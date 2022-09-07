interface ParamOfSetClientUIVisible {
  visible: 'show' | 'hide' | 'toggle'
}

export interface ModuleUiActions {
  /**
   * 设置客户端界面状态
   */
  'ui.setClientUIVisible': ParamOfSetClientUIVisible
}
