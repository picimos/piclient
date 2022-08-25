const { copyFileSync, writeFileSync } = require('fs')
const { resolve, join } = require('path')
const pkg = require('../package.json')

const dir = resolve(__dirname, '..')
const outDir = resolve(dir, 'lib')
const copyFiles = ['README.md', 'CHANGELOG.md', 'LICENSE']

function buildPlugin() {
  return {
    name: 'build:cp',
    closeBundle() {
      delete pkg.scripts
      delete pkg.files
      delete pkg.devDependencies

      writeFileSync(
        join(outDir, 'package.json'),
        JSON.stringify(pkg, null, 2),
        'utf8',
      )
      copyFiles.forEach((i) => {
        copyFileSync(join(dir, i), join(dir, 'lib', i))
      })
    },
  }
}

module.exports = buildPlugin
