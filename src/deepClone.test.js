const { deepClone } = require("./deepClone")


describe("test deepClone a object", () => {
  // 普通的对象处理
  test("clone a object", () => {
    let o1 = { a: 1, b: { c: 2 } }
    let o2 = deepClone(o1)
    expect(JSON.stringify(o1) === JSON.stringify(o2)).toBe(true)
    expect(o1 === o2).toBe(false)
    expect(o2.a).toBe(1)
    expect(o1.b === o2.b).toBe(false)
  })

  // 处理循环引用的情况
  test("clone a object with circular reference", () => {
    let o1 = { a: 1, b: { c: 2 } }
    o1.c = o1
    let o2 = deepClone(o1)
    expect(o2.c === o2).toBe(true)
    expect(o1 === o2).toBe(false)
    expect(o1.b === o2.b).toBe(false)
  })

  // 处理原型的情况
  test("clone a object with prototype", () => {
    function Cls() {
      this.a = 1
    }
    Cls.prototype.b = 2
    let o1 = new Cls()
    let o2 = deepClone(o1)
    expect(o1.a === o2.a).toBe(true)
    expect(o1.b === o2.b).toBe(true)
    expect(o2.hasOwnProperty('b')).toBe(false)
  })

  // 描述符的一些处理
  test("clone a object with prototype with enumerable: false", () => {
    let o1 = {}
    Object.defineProperty(o1, 'a', {
      value: 2,
      writable: false,
      enumerable: false,
      configurable: false
    })
    let o2 = deepClone(o1)
    expect(Object.getOwnPropertyDescriptor(o2, 'a').enumerable).toBe(false)
  })

  test("clone a frozen object", () => {
    let o1 = {}
    Object.freeze(o1)
    let o2 = deepClone(o1)
    expect(Object.isFrozen(o2)).toBe(true)
  })

  test("clone a sealed object", () => {
    let o1 = {}
    Object.seal(o1)
    let o2 = deepClone(o1)
    expect(Object.isSealed(o2)).toBe(true)
  })

  test("clone a not extensible object", () => {
    let o1 = {}
    Object.preventExtensions(o1)
    let o2 = deepClone(o1)
    expect(Object.isExtensible(o2)).toBe(false)
  })

})

