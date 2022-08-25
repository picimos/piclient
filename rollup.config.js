const path = require('path')
const { terser } = require('rollup-plugin-terser')
const typescript = require('rollup-plugin-typescript2')
import dts from 'rollup-plugin-dts'
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const pkg = require('./package.json')
const buildPlugin = require('./build')

const resolvePath = (_path) => path.resolve(__dirname, _path)

const banner = ''
// '/*!\n' +
// ` * ${pkg.name}\n` +
// ` * Version ${pkg.version}\n` +
// ` * Copyright (c) 2022-${new Date().getFullYear()}\n` +
// ' * Released under the MIT License in hn.\n' +
// ' */\n'

const config = [
  {
    // 项目入口
    input: 'src/index.ts',

    // 打包后的出口和设置
    output: [
      { file: pkg.main, format: 'cjs', banner },
      { file: pkg.module, format: 'es', banner },
      { file: pkg.browser, format: 'umd', name: 'PiClientJS', banner },
    ],

    // 使用的插件
    plugins: [
      json(),
      commonjs(),
      typescript({
        tsconfig: resolvePath('./tsconfig.json'),
      }),
      terser(),
      buildPlugin(),
    ],
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
