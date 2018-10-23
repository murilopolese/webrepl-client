import { WebREPL } from '../webrepl.js'

describe('Connection', function() {
    const WS = function() {}
    beforeEach(function() {
        simple.restore()
    })
    it('should call `connect` if `autoConnect` is true', function() {
        simple.mock(WebREPL.prototype, 'connect')
        simple.mock(window, 'WebSocket', function() {})
        let repl = new WebREPL({ autoConnect: true })
        assert(repl.connect.called)
    })
    it('shouldn\'t call `connect` if `autoConnect` is false', function() {
        simple.mock(WebREPL.prototype, 'connect')
        let repl = new WebREPL({ autoConnect: false })
        assert(!repl.connect.called)
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
    it('should keep a WebSocket instance on `ws`', function() {
        let ip = '192.168.4.1'
        simple.mock(window, 'WebSocket', WS)
        let repl = new WebREPL({ autoConnect: true })
        assert(repl.ws instanceof WS)
    })
    it('should set WebSocket `binaryType` to `arraybuffer`', function() {
        simple.mock(window, 'WebSocket', function() {})
        let repl = new WebREPL({ autoConnect: true })
        assert.equal(repl.ws.binaryType, 'arraybuffer')
    })
    it('should emit `connect` event when connected', function(done) {
        simple.mock(window, 'WebSocket', WS)
        let repl = new WebREPL({ autoConnect: true })
        repl.on('connected', function() {
            done()
        })
        repl.ws.onopen()
    })
    it('should call `_handleMessage` with argument when `onmessage` is called from WebSocket', function() {
        simple.mock(window, 'WebSocket', function() {})
        simple.mock(WebREPL.prototype, '_handleMessage')
        let repl = new WebREPL({ autoConnect: true })
        let event = { data: 'foo' }
        repl.ws.onopen()
        repl.ws.onmessage(event)
        assert(repl._handleMessage.called)
        assert.equal(repl._handleMessage.lastCall.arg, event)
    })
    it('should call `close` on the websocket instance when `disconnect` is called', function() {
        simple.mock(window, 'WebSocket', function() {})
        simple.mock(window.WebSocket.prototype, 'close')
        let repl = new WebREPL({ autoConnect: true })
        repl.disconnect()
        assert(repl.ws.close.called)
    })
})
