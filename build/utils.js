/**
 * Replaces named, dynamic imports with an UMD factory. Absolute and relative imports are ignored.
 *
 * Requires an environment that supports `Promise`.
 */
function pluginDynamicImports(options = {}) {
  return {
    name: 'dynamic-imports',
    transform(code, filename) {
      // TODO: warn/error if globalName is not specified in UMD environment.
      // TODO: global is hardcoded to window, which is wrong.
      const transformedCode = code.replace(
        /import\(['"`](?![\.\/])(.*?)['"`]\)/gi,
        (match, request) => {
          const globalName = options.globals[request]
          return `new Promise(function (resolve, reject) {
          (function (global) {
            typeof exports === 'object' && typeof module !== 'undefined' ? resolve(require("${request}")) :
            typeof define === 'function' && define.amd ? require(["${request}"], resolve, reject) :
            (global = global || self, resolve(global["${globalName}"]));
          }(window));
        })`
        },
      )

      return transformedCode
    },
  }
}

module.exports = { pluginDynamicImports }
