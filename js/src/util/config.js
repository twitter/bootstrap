/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.2): util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isElement, toType } from './index'
import Manipulator from '../dom/manipulator'

class Config {
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  static get Default() {
    return {}
  }

  _getConfigDefaultType() {
    return this.constructor.DefaultType || {}
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config)
    config = this._configAfterMerge(config)
    this._typeCheckConfig(config)
    return config
  }

  _configAfterMerge(config) {
    return config
  }

  _mergeConfigObj(config, element) {
    return {
      ...this.constructor.Default,
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    }
  }

  _typeCheckConfig(config) {
    const configTypes = this._getConfigDefaultType()
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property]
      const value = config[property]
      const valueType = isElement(value) ? 'element' : toType(value)

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(
          `${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
        )
      }
    })
  }
}

export default Config
