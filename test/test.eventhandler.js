describe('Event handling', function() {
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
    describe('should call the correspondent callback for each `binaryState`', function() {
        beforeEach(function() {
            simple.restore()
            simple.mock(window, 'WebSocket', function() {})
            repl = new WebREPL({ autoconnect: true })
        })
        let data = new ArrayBuffer(4)
        data[0] = 'W'.charCodeAt(0)
        data[1] = 'B'.charCodeAt(0)
        let callbacks = {
            11: '_initPut',
            12: '_finalPut',
            21: '_initGet',
            22: '_processGet',
            23: '_finalGet',
            31: '_getVersion'
        }
        for(let binaryState in callbacks) {
            let cb = callbacks[binaryState]
            it(`should call \`${cb}\` when \`binaryState\` is ${binaryState}`, function() {
                simple.mock(repl, cb, function() {})
                repl.binaryState = parseInt(binaryState)
                repl._handleMessage({data: data})
                console.log(repl[cb])
                assert(repl[cb].called)
            })
        }
    })
})
