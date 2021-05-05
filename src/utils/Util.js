import propPath from 'property-path'

class Util {
  static isEmptyObj (obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  }

  static _wasFound (str, chars, pos, not = false) {
    const foundChar = chars.indexOf(str.charAt(pos)) > -1
    return (foundChar && !not) || (!foundChar && not)
  }

  static indexOf (str, chars, pos, not = false) {
    for (let i = pos; i < str.length; i++) {
      if (this._wasFound(str, chars, i, not)) {
        return i
      }
    }
    return -1
  }

  static lastIndexOf (str, chars, pos, not = false) {
    for (let i = pos; i >= 0; i--) {
      if (this._wasFound(str, chars, i, not)) {
        return i
      }
    }
    return -1
  }

  static modifiedProps (oldObj, newObj, _props) {
    const mod = {}
    let props = _props
    props = props || Object.keys(oldObj)
    for (const prop of props) {
      if (!Util.areEqual(oldObj[prop], newObj[prop])) {
        mod[prop] = true
      }
    }
    return Util.isEmptyObj(mod) ? null : mod
  }

  static toKeyValue (objs, key, value) {
    const keyValue = {}
    for (const obj of objs) {
      keyValue[obj[key]] = obj[value]
    }
    return keyValue
  }

  static areArraysEqual (a1, a2) {
    return a1.length === a2.length && !a1.some((v) => a2.indexOf(v) < 0)
  }

  static cloneArray (a) {
    return a.slice(0)
  }

  /**
     * @desc Removes duplicate elements from array
     */
  static removeDuplicates (array) {
    return [...new Set(array)]
  }

  static areEqual (v1, v2) {
    // Get the value type
    const type = Object.prototype.toString.call(v1)

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(v2)) return false

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
      return v1 === v2
    }

    // Compare the length of the length of the two items
    const valueLen = type === '[object Array]' ? v1.length : Object.keys(v1).length
    const otherLen = type === '[object Array]' ? v2.length : Object.keys(v2).length
    if (valueLen !== otherLen) return false

    // Compare two items
    function compare (item1, item2) {
      // Get the object type
      const itemType = Object.prototype.toString.call(item1)

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!Util.areEqual(item1, item2)) {
          return false
        }
      } else {
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false
        } else if (item1 !== item2) return false
      }

      return false
    }

    // Compare properties
    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        if (compare(v1[i], v2[i]) === false) return false
      }
    } else {
      for (const key in v1) {
        if (v1.hasOwnProperty(key)) {
          if (compare(v1[key], v2[key]) === false) return false
        }
      }
    }

    // If nothing failed, return true
    return true
  }

  static getProperty (object, path, valueIfMissing = null) {
    let value = null
    if (object) {
      value = propPath.get(object, path)
    }
    return value == null ? valueIfMissing : value
  }

  static removeLeadingZeros (_value) {
    const value = _value.toString()
    return value.replace(/^0*/, '')
  }

  static getValueOfKey (key, array) {
    // recorr array
    for (const item in array) {
      if (array[item].value === key) {
        return array[item].display
      }
    }
    return null
  }

  static isString (value) {
    return typeof value === 'string' || value instanceof String
  }

  static intToHex (number) {
    return number.toString(16).padStart(2, '0')
  }

  static async hydrate (objs, keyProp, hydratedProp, hydrateFn) {
    let keyValues = []
    for (const obj of objs) {
      const keyValue = obj[keyProp]
      if (keyValue != null) keyValues.push(keyValue)
    }
    keyValues = Util.removeDuplicates(keyValues)
    if (keyValues.length === 0) {
      return objs
    }
    const keyData = await hydrateFn(keyValues)
    for (const obj of objs) {
      obj[hydratedProp] = keyData[obj[keyProp]]
    }
    return objs
  }

  static arrayToMap (objs, keyProp) {
    const map = {}
    for (const obj of objs) {
      let keys = obj[keyProp]
      keys = Array.isArray(keys) ? keys : [keys]
      for (const key of keys) {
        map[key] = obj
      }
    }
    return map
  }

  static propToArray (objs, prop) {
    const values = []
    for (const obj of objs) {
      values.push(obj[prop])
    }
    return values
  }

  static buildTree (objs, idProp, parentIdProp, rootOnly = false) {
    const objMap = Util.arrayToMap(objs, idProp)
    for (const obj of objs) {
      const parentId = obj[parentIdProp]
      if (parentId) {
        const parent = objMap[parentId]
        if (parent) {
          obj.parent = parent
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(obj)
        }
      }
    }
    if (rootOnly) {
      objs = objs.filter(obj => obj.parent == null)
    }
    return objs
  }

  static flattenTree (node) {
    const flattened = []
    this._flattenTree(node, 0, flattened)
    return flattened
  }

  static _flattenTree (node, level, flattened) {
    node.level = level
    flattened.push(node)
    const { children } = node
    if (children) {
      for (const child of children) {
        this._flattenTree(child, level + 1, flattened)
      }
    }
  }
}

export default Util
