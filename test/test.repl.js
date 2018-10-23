import { WebREPL } from '../webrepl.js'

describe('REPL commands', function() {
    let repl
    beforeEach(function() {
        simple.restore()
        simple.mock(window, 'WebSocket', function() {})
        repl = new WebREPL({ autoConnect: true })
    })
    
    it('should eval keyboard interrupt when calling `sendStop`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.sendStop()
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, repl.STOP)
    })
    it('should eval characters to soft reset when calling `softReset`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.softReset()
        assert(repl.eval.called)
        assert.equal(repl.eval.callCount, 2)
        assert.equal(repl.eval.calls[0].arg, repl.STOP)
        assert.equal(repl.eval.calls[1].arg, repl.RESET)
    })
    it('should eval characters to enter raw repl when calling `enterRawRepl`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.enterRawRepl().catch(() => {})
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, repl.ENTER_RAW_REPL)
    })
    it('should resolve `enterRawRepl` after webrepl printing `raw REPL; CTRL-B to exit`', function(done) {
        simple.mock(repl, 'eval', function() {})
        repl.enterRawRepl().then(done)
        repl.on('connected', () => {
            repl._handleMessage({ data: 'raw REPL; CTRL-B to exit' })
        })
        repl.ws.onopen()
    })
    it('should paste code and `EXECUTE_RAW_REPL` character when calling `execRaw`', function() {
        simple.mock(repl, 'eval', function() {})
        let code = `print('hello world!')`
        repl.execRaw(code).catch(() => {})
        assert.equal(repl.eval.callCount, 2)
        assert.equal(repl.eval.calls[0].arg, code)
        assert.equal(repl.eval.calls[1].arg, repl.EXECUTE_RAW_REPL)
    })
    it('should call eval as many times as lines in the code plus `EXECUTE_RAW_REPL` when calling `execRaw` with interval', function(done) {
        simple.mock(repl, 'eval', function() {})
        let code = `print('hello world!')\nprint('hello world!')\nprint('hello world!')\nprint('hello world!')\n`
        repl.execRaw(code, 1).then(() => {
            assert.equal(repl.eval.callCount, code.split('\n').length+1)
            done()
        })
        setTimeout(() => {
            repl._handleMessage({ data: 'OK' })
        }, code.split('\n').length+1)
    })
    it('should eval characters to exit raw repl when calling `exitRawRepl`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.exitRawRepl().catch(() => {})
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, repl.EXIT_RAW_REPL)
    })
    it('should resolve `exitRawRepl` after webrepl printing `Type "help()" for more information.`', function(done) {
        simple.mock(repl, 'eval', function() {})
        repl.exitRawRepl().then(done)
        repl.on('connected', () => {
            repl._handleMessage({ data: 'Type "help()" for more information.' })
        })
        repl.ws.onopen()
    })
    it('should eval command appending a line break `/r` when calling `exec`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.exec('print("hello world")')
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, 'print("hello world")\r')
    })
    it('should resolve `execFromString` after calling `sendStop`, `enterRawRepl`, `execRaw` and `exitRawRepl` in sequence', function(done) {
        let code = `for i in range(0, 10):\n    print('hello world', i)\n`
        simple.mock(repl, 'eval', function() {})
        simple.mock(repl, 'sendStop', function() {})
        simple.mock(repl, 'enterRawRepl', function() {}).resolveWith()
        simple.mock(repl, 'execRaw', function() {}).resolveWith()
        simple.mock(repl, 'exitRawRepl', function() {}).resolveWith()
        repl.execFromString(code).then(() => {
            assert(repl.sendStop.called)
            assert(repl.enterRawRepl.called)
            assert(repl.execRaw.called)
            assert(repl.exitRawRepl.called)
            done()
        })
    })
    it('should send command to websocket connection when calling `eval`', function() {
        simple.mock(repl.ws, 'send')
        repl.eval('print("hello world")\r')
        assert(repl.ws.send.called)
        assert.equal(repl.ws.send.lastCall.arg, 'print("hello world")\r')
    })
    it('should return `0` when decoding valid ArrayBuffer response', () => {
        throw new Error('Must implement')
    })
    it('should return `-1` when decoding invalid ArrayBuffer response', () => {
        throw new Error('Must implement')
    })

    describe('Sending file', function() {
        it('should timeout if webrepl does not send response within `timeout`', function() {
            throw new Error('Must implement')
        })
        it('should send chunks of file after receiving first `ArrayBuffer` from repl', function() {
            throw new Error('Must implement')
        })
        it('should resolve after receiving two `ArrayBuffer`s from repl', function(done) {
            simple.mock(repl.ws, 'send', function() {})
            simple.mock(repl, '_decode_response').returnWith(0)
            repl.sendFile('foo.py', new Uint8Array()).then(done)
            repl._handleMessage({ data: new ArrayBuffer() })
            repl._handleMessage({ data: new ArrayBuffer() })
        })
        it('should get a Uint8Array correctly populated when calling `_getPutBinary`', function() {
            simple.mock(repl.ws, 'send', function() {})
            let fname = 'foo.py'
            let fsize = 'print("hello world")'.length
            let rec = repl._getPutBinary(fname, fsize)
            assert.instanceOf(rec, Uint8Array)
            assert.equal(rec.length, 82)
            assert.equal(rec[0], 'W'.charCodeAt(0))
            assert.equal(rec[1], 'A'.charCodeAt(0))
            assert.equal(rec[2], 1)
            assert.equal(rec[12], fsize & 0xff)
            assert.equal(rec[13], (fsize >> 8) & 0xff)
            assert.equal(rec[14], (fsize >> 16) & 0xff)
            assert.equal(rec[15], (fsize >> 24) & 0xff)
            assert.equal(rec[16], fname.length & 0xff)
            assert.equal(rec[17], (fname.length >> 8) & 0xff)
            for (let i = 0; i < 64; ++i) {
                if (i < fname.length) {
                    assert.equal(rec[18 + i], fname.charCodeAt(i))
                } else {
                    assert.equal(rec[18 + i], 0)
                }
            }
        })
        it('should send correct binary data', function(done) {
            simple.mock(repl.ws, 'send', function(data) {
                assert.deepEqual(data, repl._getPutBinary(filename, buffer.length))
                done()
            })
            let filename = 'foo.py'
            let buffer = new TextEncoder("utf-8").encode('print("hello world!")');
            repl.sendFile(filename, buffer).catch(() => {})
        })
    })

    describe('Requesting file', function() {
        it('should timeout if webrepl does not send response within `timeout`', function() {
            throw new Error('Must implement')
        })
        it('should send send an empty `Uint8Array` to webrepl after receiving first `ArrayBuffer` response', function() {
            throw new Error('Must implement')
        })
        it('should append `Uint8Array` data to `fileBuffer` when receiving initial `ArrayBuffer`', function() {
            throw new Error('Must implement')
        })
        it('should send empty `Uint8Array` to request another chunk from the file', function() {
            throw new Error('Must implement')
        })
        it('should resolve with `fileBuffer` when done receiving file data', function() {
            throw new Error('Must implement')
        })
        it('should get a Uint8Array correctly populated when calling `_getGetBinary`', function() {
            simple.mock(repl.ws, 'send', function() {})
            let fname = 'foo.py'
            let rec = repl._getGetBinary(fname)
            assert.instanceOf(rec, Uint8Array)
            assert.equal(rec.length, 82)
            assert.equal(rec[0], 'W'.charCodeAt(0))
            assert.equal(rec[1], 'A'.charCodeAt(0))
            assert.equal(rec[2], 2)
            assert.equal(rec[16], fname.length & 0xff)
            assert.equal(rec[17], (fname.length >> 8) & 0xff)
            for (let i = 0; i < 64; ++i) {
                if (i < fname.length) {
                    assert.equal(rec[18 + i], fname.charCodeAt(i))
                } else {
                    assert.equal(rec[18 + i], 0)
                }
            }
        })
        it('should send correct binary data when calling `sendFile`', function(done) {
            simple.mock(repl.ws, 'send', function(data) {
                assert.deepEqual(data, repl._getGetBinary(filename))
                done()
            })
            let filename = 'foo.py'
            repl.loadFile(filename)
        })
    })

})
