import * as schemes from "~/schemes"
// @ponicode
describe("schemes.isIterableObject", () => {
    test("0", () => {
        let callFunction: any = () => {
            schemes.isIterableObject(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("schemes.traverseAndFlatten", () => {
    test("0", () => {
        let callFunction: any = () => {
            schemes.traverseAndFlatten("Architect", { key0: "This is a Text" }, "dummyName")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            schemes.traverseAndFlatten("Producer", { key0: "foo bar" }, "dummy_name/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            schemes.traverseAndFlatten("Producer", { key0: "Foo bar" }, "dummy_name/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            schemes.traverseAndFlatten("Producer", { key0: "Foo bar" }, "dummy_name")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            schemes.traverseAndFlatten("Developer", { key0: "foo bar" }, "dummy_name/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let inst: any = new Date("")
        let callFunction: any = () => {
            schemes.traverseAndFlatten(NaN, { key0: null, key1: NaN, key2: NaN, key3: undefined, key4: inst }, "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("schemes.flattenCondition", () => {
    test("0", () => {
        let callFunction: any = () => {
            schemes.flattenCondition({})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            schemes.flattenCondition(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            schemes.flattenCondition(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            schemes.flattenCondition(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("schemes.createCondition", () => {
    test("0", () => {
        let callFunction: any = () => {
            schemes.createCondition(["District"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            schemes.createCondition([-5.48, "Corporate", 0, "Corporate"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            schemes.createCondition([0, "Corporate", -5.48, "Legacy"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            schemes.createCondition([-100])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            schemes.createCondition([true, -100, "Future", false, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            schemes.createCondition([])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("schemes.isSameFlattendCondition", () => {
    test("0", () => {
        let callFunction: any = () => {
            schemes.isSameFlattendCondition(true, -5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            schemes.isSameFlattendCondition("black", { 1: 90, key5: -5.48 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            schemes.isSameFlattendCondition(false, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            schemes.isSameFlattendCondition("rgb(20%,10%,30%)", { 1: 550, key5: -5.48 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            schemes.isSameFlattendCondition({ key0: "dummy_name/", 6: 100 }, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            schemes.isSameFlattendCondition("", { 1: NaN, key5: NaN })
        }
    
        expect(callFunction).not.toThrow()
    })
})
