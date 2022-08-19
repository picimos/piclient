# piclient.js

PiClient(Pronounced as: /paɪ ˈklaɪənt/) js bridge.

---

> ## 需在 PiCIMOS 客户端中运行.

---

## Quick start

```typescript
import { PiClient } from 'piclient.js'

const piClient = new PiClient({ debug: true })

piClient
  .pageReady()
  .then(() => {
    // 客户端场景对象加载完成
  })
  .catch((err) => {})
```

## 事件交互

```typescript
// 1. 控制相机移动(场景视角偏移)

// 获取相机控制
piClient.trigger('scene.setCanvasMovingState', { bMoving: true })

// 移动相机 (基于获取控制权时的偏移量)
piClient.trigger('scene.moveCameraByOffset', { offsetX: 123, offsetY: 0 })

// 释放前可多次触发scene.moveCameraByOffset

// 释放相机控制
piClient.trigger('scene.setCanvasMovingState', { bMoving: false })
```

```typescript
// 2. 动态事件交互(基于客户端推送的 `baseDb.actions`)

// 相机飞行
piClient.trigger('mode.event', {
  action: "camera.fly"
  // 目标地理坐标, 格式：经度,维度,高程
  geo: ""
  // 目标对象name
  target: ""
  // 飞行时间
  time: "2"
})

// 对象显隐
piClient.trigger('mode.event', {
  action: "object.visible"
  // 目标对象name
  target: ""
  // show|hide|toggle
  visible: ""
})

// etc.
// 创建对象         (object.create)
// 移动对象         (object.move)
// 对象显隐         (object.visible)
// 销毁对象         (object.destroy)
// 设置材质参数集    (object.setmpc)
// 图层显隐         (object.layerVisible)
// 相机聚焦对象      (camera.focus)
// 相机飞行         (camera.fly)
// 相机动画         (camera.animControl)
// 设置时间         (environment.setTime)
// 设置天气         (environment.setWeather)
// 时光流逝         (environment.timepass)
```
