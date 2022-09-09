const path = require('path')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const { terser } = require('rollup-plugin-terser')
const typescript = require('rollup-plugin-typescript2')
import dts from 'rollup-plugin-dts'
import serve from 'rollup-plugin-serve'
import externalGlobals from 'rollup-plugin-external-globals'
const pkg = require('./package.json')
const buildPlugin = require('./build')

const resolvePath = (...paths) => path.resolve(__dirname, ...paths)

const banner = ''
// '/*!\n' +
// ` * ${pkg.name}\n` +
// ` * Version ${pkg.version}\n` +
// ` * Copyright (c) 2022-${new Date().getFullYear()}\n` +
// ' * Released under the MIT License in hn.\n' +
// ' */\n'

const isProd = process.env.NODE_ENV === 'production'

const externals = {
  'live-cat': 'LiveCat',
}

const envPlugins = isProd
  ? [terser(), buildPlugin()]
  : [
      serve({
        open: true,
        openPage: '/mockClient.html',
        host: 'localhost',
        port: 34666,
        contentBase: ['example', 'lib'],
      }),
    ]

const commonPlugins = [
  json(),
  commonjs(),
  typescript({
    tsconfig: resolvePath('./tsconfig.json'),
  }),

  ...envPlugins,
]

const config = [
  {
    // 项目入口
    input: 'src/index.ts',

    // 打包后的出口和设置
    output: [
      { file: pkg.main, format: 'cjs', banner },
      { file: pkg.module, format: 'es', banner },
    ],

    // 使用的插件
    plugins: commonPlugins,
  },
  {
    // 项目入口
    input: 'src/index.ts',

    // 打包后的出口和设置
    output: [{ file: pkg.browser, format: 'umd', name: 'PiClientJS', banner }],

    // 使用的插件
    plugins: [...commonPlugins, externalGlobals(externals)],

    external: Object.keys(externals),
  },
  // 生成类型声明文件
  {
    input: 'src/index.ts',
    output: [
      {
        file: path.join(resolvePath(pkg.types), 'index.d.ts'),
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
]

export default config
