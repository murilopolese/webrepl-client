describe('Handling events', function() {
    beforeEach(function() {
        simple.restore()
        simple.mock(window, 'WebSocket', function() {})
        repl = new WebREPL({ autoconnect: true })
    })
    it('should return -1 when calling `_decodeResp` with unexpected data', function() {
        let data = new ArrayBuffer(4)
        assert.equal(repl._decodeResp(data), -1)
    })
    it('should return correct info when calling `_decodeResp` with correct data', function() {
        let data = new ArrayBuffer(4)
        data[0] = 'W'.charCodeAt(0)
        data[1] = 'B'.charCodeAt(0)
        assert.equal(repl._decodeResp(data), data[2] | (data[3] << 8))
    })
    it('should send password if data is "Password: "', function() {
        simple.mock(repl.ws, 'send', function() {})
        repl._handleMessage({data: 'Password: '})
        assert(repl.ws.send.called)
        assert.equal(repl.ws.send.lastCall.arg, `${repl.password}\r`)
    })
    it('should call onMessage with data if data is just a string', function() {
        simple.mock(repl.ws, 'send', function() {})
        simple.mock(repl, 'onMessage')
        let data = 'hello world'
        repl._handleMessage({data: data})
        assert(repl.onMessage.called)
        assert.equal(repl.onMessage.lastCall.arg, data)
    })
})
describe('Handling Get/Put file', function() {
    beforeEach(function() {
        simple.restore()
        simple.mock(window, 'WebSocket', function() {})
        repl = new WebREPL({ autoconnect: true })
    })
    let data = new ArrayBuffer(4)
    data[0] = 'W'.charCodeAt(0)
    data[1] = 'B'.charCodeAt(0)
    let invalidData = new ArrayBuffer(4)
    invalidData[0] = 'W'.charCodeAt(0)
    invalidData[1] = 'B'.charCodeAt(0)
    invalidData[2] = 1
    invalidData[3] = 1
    let callbacks = {
        11: '_initPut',
        12: '_finalPut',
        21: '_initGet',
        22: '_processGet',
        23: '_finalGet'
    }
    for(let binaryState in callbacks) {
        let cb = callbacks[binaryState]
        it(`should call \`${cb}\` when \`binaryState\` is ${binaryState}`, function() {
            simple.mock(repl, cb, function() {})
            repl.binaryState = parseInt(binaryState)
            repl._handleMessage({data: data})
            assert(repl[cb].called)
        })
    }
    let newStates = {
        '_initPut': 12,
        '_finalPut': 0,
        '_initGet': 22,
        '_finalGet': 0
    }
    for(let method in newStates) {
        let newState = newStates[method]
        it(`should change \`binaryState\` to \`${newState}\` when calling \`${method}\``, function() {
            simple.mock(repl.ws, 'send', function() {})
            repl[method](data)
            assert.equal(repl.binaryState, newState)
        })
    }
    for(let method in newStates) {
        let newState = newStates[method]
        it(`should not change \`binaryState\` when calling \`${method}\` with invalid data`, function() {
            simple.mock(repl.ws, 'send', function() {})
            repl[method](invalidData)
            assert.equal(repl.binaryState, 0)
        })
    }
    it('should send data to websocket when calling `_initPut` with data length smaller than 1024', function() {
        simple.mock(repl.ws, 'send', function() {})
        let buffer = new TextEncoder("utf-8").encode('print("hello world!")')
        repl.sendFileData = buffer
        repl._initPut(data)
        assert(repl.ws.send.called)
        assert.deepEqual(repl.ws.send.lastCall.arg, buffer)
    })
    it('should send slices of data to websocket when calling `_initPut` with data length larger than 1024', function() {
        simple.mock(repl.ws, 'send', function() {})
        let content = ''
        for(let i = 0; i < (1024*2)+100; i++) {
            content += '.'
        }
        let buffer = new TextEncoder("utf-8").encode(content)
        repl.sendFileData = buffer
        repl._initPut(data)
        assert(repl.ws.send.called)
        assert.equal(repl.ws.send.callCount, 3)
        assert.deepEqual(repl.ws.send.calls[0].arg, buffer.slice(0, 1024))
        assert.deepEqual(repl.ws.send.calls[1].arg, buffer.slice(1024, 2*1024))
        assert.deepEqual(repl.ws.send.calls[2].arg, buffer.slice(2*1024, 3*1024))

    })
    it('should send emtpy `Uint8Array` when calling `_initGet`', function() {
        simple.mock(repl.ws, 'send', function() {})
        let rec = new Uint8Array(1)
        rec[0] = 0
        repl._initGet(data)
        assert(repl.ws.send.called)
        assert.deepEqual(repl.ws.send.lastCall.arg, rec)
    })
    // Process get
    it('should set binaryState to 0 when calling `_processGet`', function() {
        // TODO: Understand how _processGet works
    })
    it('should set binaryState to 23 if data is empty when calling `_processGet`', function() {
        // TODO: Understand how _processGet works
    })

})
