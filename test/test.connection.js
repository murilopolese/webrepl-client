describe('Connection', function() {
    beforeEach(function() {
        simple.restore()
    })
    it('should try to connect to the correct ip', function(done) {
        let ip = '192.168.4.1'
        simple.mock(window, 'WebSocket', function(_ip) {
            assert.equal(_ip, `ws://${ip}:8266`)
            done()
        })
        let repl = new WebREPL({ ip: ip })
        repl.connect()
    })
    it('should keep WebSocket instance on `ws`', function() {
        let ip = '192.168.4.1'
        simple.mock(window, 'WebSocket', function() {})
        let repl = new WebREPL({ autoconnect: true })
        assert(repl.ws)
    })
    it('should set WebSocket `binaryType` to `arraybuffer`', function() {
        simple.mock(window, 'WebSocket', function() {})
        let repl = new WebREPL({autoconnect: true})
        assert.equal(repl.ws.binaryType, 'arraybuffer')
    })
    it('should call `onConnected` when WebSocket connection is opened', function() {
        simple.mock(window, 'WebSocket', function() {})
        simple.mock(WebREPL.prototype, 'onConnected')
        let repl = new WebREPL({ autoconnect: true })
        repl.ws.onopen()
        assert(repl.onConnected.called)
    })
    it('should call `_handleMessage` when `onmessage` is called from WebSocket', function() {
        simple.mock(window, 'WebSocket', function() {})
        simple.mock(WebREPL.prototype, '_handleMessage')
        let repl = new WebREPL({ autoconnect: true })
        repl.ws.onopen()
        repl.ws.onmessage('foo')
        assert(repl._handleMessage.called)
        assert.equal(repl._handleMessage.lastCall.arg, 'foo')
    })
    it('should call `close` when `disconnect` is called', function() {
        simple.mock(window, 'WebSocket', function() {})
        simple.mock(window.WebSocket.prototype, 'close')
        let repl = new WebREPL({ autoconnect: true })
        repl.disconnect()
        assert(repl.ws.close.called)
    })
})
