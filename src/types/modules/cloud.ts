export interface ParamOfCloudInit {
  /**
   * 账号ID
   */
  accountId?: string
  /**
   * 账号名
   */
  accountName?: string
  /**
   * 账号token, 编辑模式必须
   */
  token?: string
  /**
   * 打开的项目ID
   */
  projectId: string
  /**
   * 是否显示界面UI, 默认false
   */
  showUI?: boolean
  /**
   * 是否进入编辑模式, 默认false
   */
  editorMode?: boolean
}

export interface ModuleCloudActions {
  /**
   * 云渲染初始化
   */
  'cloud.init': ParamOfCloudInit
}
