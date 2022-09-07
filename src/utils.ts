const $c = window.console
export function log(msg: string, ...args: any[]) {
  $c.log(`%c [PiClientJS] ${msg}`, 'color:#eb906e', ...args)
}
export function logErr(msg: string, ...args: any[]) {
  $c.log(`%c [PiClientJS Error] ${msg}`, 'color:red', ...args)
}

export function camelCase(name: string) {
  const SPECIAL_CHARS_REGEXP = /([\:\-\_\.]+(.))/g
  const MOZ_HACK_REGEXP = /^moz([A-Z])/
  return name
    .replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}
