import { Launcher, LauncherPrivate, LivePlayer } from 'live-cat'
import { Connection } from 'ray-streaming/types'
import { CloudrenderIns, CloudrenderOptions, DisconnectMsg } from './types'

const PUBLIC_CLOUD_ADDRESS = 'https://app.3dcat.live'

export function useCloudrender(options: CloudrenderOptions) {
  let launcher: Launcher | LauncherPrivate | null
  let player: LivePlayer | null
  let connection: Connection | null
  const ins = {} as CloudrenderIns

  const {
    address,
    appKey,
    $el = document.body,
    readyCB,
    disconnectCB,
    onProgress,
    report,
  } = options
  const isPub = address.includes(PUBLIC_CLOUD_ADDRESS)

  let reportTimer: any
  const onReport = () => {
    // launcher.toggleStatistics()
    reportTimer = setInterval(() => {
      report?.(launcher!.report()!)
    }, 1000)
  }

  const disconnectFn = (msg: DisconnectMsg) => {
    disconnectCB?.(msg)

    clearInterval(reportTimer)
  }

  // const { Launcher: pubLauncher, LauncherPrivate: privateLauncher } =
  //   await import('live-cat')

  const init = async () => {
    try {
      onProgress?.(20)
      launcher = new (isPub ? Launcher : LauncherPrivate)({
        baseOptions: {
          address,
          appKey,
          startType: 1,
        },
        extendOptions: {
          onPlay: () => {
            if (report) onReport()

            player!.setVideoVolume(1)

            readyCB?.()
            onProgress?.(100)

            return {}
          },
        },
      })
      await launcher.automata($el)

      connection = launcher.getConnection()

      ins.emit = (msg) => connection!.emitUIInteraction(msg)
      ins.onMessage = connection.event.interaction.on

      connection.event.close.on(() => {
        disconnectFn('连接中断')
      })
      connection.event.disconnect.on(() => {
        disconnectFn('信令断开')
      })
      connection.event.afk.on(() => {
        disconnectFn('超时断开')
      })

      player = launcher.getPlayer()

      player.showLoadingText('服务启动中···')
      onProgress?.(30)

      connection.event.connect.on(() => {
        player!.showLoadingText('服务连接中···')
        onProgress?.(50)
      })
      connection.event.dataChannelConnected.on(() => {
        player!.showLoadingText('资源加载中···')
        onProgress?.(70)
      })
    } catch (err) {
      throw new Error('Faild to initialize cloudrender.' + err)
    }
  }

  const destroy = () => {
    clearInterval(reportTimer)
    launcher?.destory('')
    launcher = null
    connection = null
  }

  ins.init = init
  ins.destroy = destroy

  return ins
}
