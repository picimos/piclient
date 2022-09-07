# piclient.js

PiClient(Pronounced as: /paɪ ˈklaɪənt/) JS SDK.
The JSBridge for the client of PiCIMOS.

---

> ## 需在 PiCIMOS 客户端中运行.

---

## Quick start

```typescript
import { PiClient } from 'piclient.js'

const piclient = new PiClient({ debug: true })

/**
 * 页面加载完成时 需调用`pageReady`
 */
piclient
  .pageReady()
  .then((baseDb: PiClientBaseDatas) => {
    // 客户端场景对象加载完成
  })
  .catch((err) => {})
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

> ## 更多 API 请查看 [API 列表](https://github.com/ioolllzzzz/piclient.js/blob/main/PiAPIs.md)

---

> ## [更新日志](https://github.com/ioolllzzzz/piclient.js/blob/main/CHANGELOG.md)
