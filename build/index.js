const { copyFileSync, writeFileSync } = require('fs')
const { resolve, join } = require('path')
const pkg = require('../package.json')

const dir = resolve(__dirname, '..')
const outDir = resolve(dir, 'lib')
const copyFiles = ['README.md', 'CHANGELOG.md', 'LICENSE']

const cleanPkg = () => {
  delete pkg.scripts
  delete pkg.files
  delete pkg.devDependencies
  ;['main', 'module', 'browser', 'types'].forEach((i) => {
    pkg[i] = pkg[i].replace('lib/', '')
  })
}

function buildPlugin() {
  return {
    name: 'build:cp',
    closeBundle() {
      cleanPkg()

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
