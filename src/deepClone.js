

function deepClone(source) {
  const target = Object.create(Object.getPrototypeOf(source))
  const stack = [
    {
      target: target,
      source: source
    }
  ]

  const map = new Map()
  map.set(source, target)
  while (stack.length) {
    let { target, source } = stack.pop()
    for (let key of Object.getOwnPropertyNames(source)) {
      let descriptor = Object.getOwnPropertyDescriptor(source, key)
      if (descriptor.hasOwnProperty('value')) {
        if (typeof source[key] === 'object') {
          if (map.get(source[key])) {
            descriptor.value = map.get(source[key])
          } else {
            descriptor.value = Object.create(Object.getPrototypeOf(source[key]))
            map.set(source[key], descriptor.value)
            stack.push({
              source: source[key],
              target: descriptor.value
            })
          }
        } else {
          descriptor.value = source[key]
        }
        Object.defineProperty(target, key, descriptor)
      } else {
        Object.defineProperty(target, key, descriptor)
      }
    }
  }

  if (Object.isFrozen(source)) {
    Object.freeze(target)
  }
  if (Object.isSealed(source)) {
    Object.seal(target)
  }
  if(!Object.isExtensible(source)) {
    Object.preventExtensions(target)
  }

  return target
}

exports.deepClone = deepClone