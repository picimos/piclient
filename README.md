# piclient.js

PiClient(Pronounced as: /paɪ ˈklaɪənt/) JS SDK.

The JSBridge for the client of PiCIMOS.

Alternatively you can use it to enable cloudrender to interact with PiCIMOS.

---

## Quick start

### 🥇 在 PiCIMOS 客户端中运行.

- #### 直接用 `<script>` 引入

  直接下载或使用 CDN 链接通过 `<script>` 标签引入，将会注册一个 `PiClientJS` 全局变量。

  ```html
  <script src="https://cdn.jsdelivr.net/npm/piclient.js@latest/index.umd.js"></script>
  ```

  ```html
  <script>
    const { PiClient } = PiClientJS
  </script>
  ```

  如果你使用原生 ES Modules，这里也有一个兼容的构建文件：

  ```html
  <script type="module">
    import { PiClient } from 'https://cdn.jsdelivr.net/npm/piclient.js@latest/index.esm.js'
  </script>
  ```

- #### 使用构建工具

  ```shell
  $ npm install piclient.js
  ```

  ```typescript
  import { PiClient } from 'piclient.js'
  ```

  #### **Usage**

  ```typescript
  const piclient = new PiClient({ debug: true })

  /**
   * 页面加载完成时 需调用`pageReady`
   */
  await piclient
    .pageReady()
    .then((baseDb: PiClientBaseDatas) => {
      // 客户端场景对象加载完成
    })
    .catch((err) => {})

  // 与客户端交互...
  ```

### 🥈 在浏览器中使用云渲染加载 PiCIMOS 客户端.

- #### 直接用 `<script>` 引入

  同上。但需前置引入云渲染工具相关依赖，参考[这里](https://www.3dcat.live/support/api/browser-link.html)(2、浏览器直接接入代码参考)。

  ```html
  <!-- 前置依赖引入 -->
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/piclient.js@latest/index.umd.js"></script>
  ```

  ```html
  <script>
    const { PiClient } = PiClientJS
  </script>
  ```

  _注：使用云渲染不支持原生 ES Modules 引入方式。_

- #### 使用构建工具

  同上。

  #### **Usage**

  ```typescript
  const piclient = new PiClient({ debug: true })

  const initOptions: PiCloudrenderOptions = {
    // $el: document.body, // 初始化时确保挂载的元素已存在
    address: 'httpxxx',
    appKey: 'xxx',

    token: '',
    projectId: 'xxx',

    // ...
  }

  // 初始化云渲染
  await piclient.cloudrender
    .init(initOptions)
    .then((baseDb: PiClientBaseDatas) => {
      // 客户端场景对象加载完成
    })
    .catch((err) => {
      // 初始化异常 或 云渲染连接断开
    })

  // 与客户端交互...
  ```

## 事件交互

- `emit` 触发事件行为

  1. API 列表中提供的事件行为
  2. 动态事件交互(基于客户端推送的 `baseDb.actions`)

  ```typescript
  piclient
    .emit(action, param?, callback?)
    .then((res: PiClientCallbackParams) => {})

  //--- 调用示例 ---

  // 对象显隐
  piclient.emit('object.visible', {
    // 目标对象name
    target: '',
    // show|hide|toggle
    visible: '',
  })

  // etc.
  // (object.create)             创建对象
  // (object.move)               移动对象
  // (object.visible)            对象显隐
  // (object.destroy)            销毁对象
  // (object.setmpc)             设置材质参数集
  // (object.layerVisible)       图层显隐
  // (camera.focus)              相机聚焦对象
  // (camera.fly)                相机飞行
  // (camera.animControl)        相机动画
  // (environment.setTime)       设置时间
  // (environment.setWeather)    设置天气
  // (environment.timepass)      时光流逝
  // ...
  ```

- `on` 绑定监听事件行为

  1. 自定义的客户端通信回调行为
  2. 监听客户端事件通信(基于客户端推送的 `baseDb.classEvents`)

  - 注：`baseDb.classEvents` 中的事件行为名后续版本将修改统一命名格式

  ```typescript
  piclient.on(action, target, fn) => void

  //--- 调用示例 ---

  // 监听客户端对象点击
  piclient.on('objectClick', 'SceneMeshObject_0', (res) => {
    // 对象 SceneMeshObject_0 被点击了
  })

  // etc.
  // (objectClick)        点击
  // (move)               移动
  // (scale)              缩放
  // (visible)            显隐
  // (objectCreated)      创建
  // (objectDestroyed)    销毁
  // (attach)             附加
  // (detach)             脱离
  // (meshChange)         模型变更
  // (materialChange)     材质变更
  // ...
  ```

- `once` 绑定仅监听一次事件行为

  同 `on`，但仅会触发一次

  ```typescript
  piclient.once(action, target, fn) => void

  //--- 调用示例 ---

  // 监听一次客户端对象点击
  piclient.once('objectClick', 'SceneMeshObject_0', (res) => {
    // 对象 SceneMeshObject_0 被点击了，再点击这里就进不来了
  })
  ```

- `off` 解绑监听事件行为

  ```typescript
  piclient.off(action, target?) => boolean

  //--- 调用示例 ---

  // 解绑 SceneMeshObject_0 对象上的点击事件行为
  piclient.off('objectClick', 'SceneMeshObject_0')

  // 解绑所有对象的点击事件行为
  piclient.off('objectClick')
  ```

---

> ## 更多 API 请查看 [API 列表](https://github.com/picimos/piclient/blob/main/PiAPIs.md)
