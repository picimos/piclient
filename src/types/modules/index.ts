import { ModuleUiActions } from './ui'
import { ModuleModeActions } from './mode'
import { ModuleGeneralActions } from './general'
import { ModuleCloudActions } from './cloud'

export interface Actions
  extends ModuleUiActions,
    ModuleModeActions,
    ModuleGeneralActions,
    ModuleCloudActions {}

export interface DynamicActions extends Actions {
  [action: string]: any
}

export type ActionName = keyof Actions

// export function ActionOfJ2C<K extends ActionName>(action: K, params: Actions[K]): void
// export function ActionOfJ2C(action: string, params?: any): void

// //#region test
// function ActionOfJ2C<K extends ActionName & string>(
//   action: K | string,
//   params?: Actions[K],
// ) {
//   console.log('test:', action, params)
//   return true
// }

// ActionOfJ2C('ui.setClientUIVisible', { visible: 'show' })
// ActionOfJ2C('mode.enterEditMode')
// ActionOfJ2C('mode.enterPlayMode')

// ActionOfJ2C('asd')
// //#endregion
