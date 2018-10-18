let repl
describe('REPL commands', function() {
    beforeEach(function() {
        simple.restore()
        simple.mock(window, 'WebSocket', function() {})
        repl = new WebREPL({ autoconnect: true })
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
        repl.enterRawRepl()
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, repl.ENTER_RAW_REPL)
    })
    it('should eval characters to exit raw repl when calling `exitRawRepl`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.exitRawRepl()
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, repl.EXIT_RAW_REPL)
    })
    it('should eval command appending a line break `/r`', function() {
        simple.mock(repl, 'eval', function() {})
        repl.exec('print("hello world")')
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, 'print("hello world")\r')
    })
    it('should eval code on raw repl when calling `execFromString`', function() {
        let code = `for i in range(0, 10):\n    print('hello world', i)\n`
        simple.mock(repl, 'eval', function() {})
        simple.mock(repl, 'sendStop', function() {})
        simple.mock(repl, 'enterRawRepl', function() {})
        simple.mock(repl, 'exitRawRepl', function() {})
        repl.execFromString(code)
        assert(repl.sendStop.called)
        assert(repl.enterRawRepl.called)
        assert(repl.eval.called)
        assert.equal(repl.eval.lastCall.arg, code)
        assert(repl.exitRawRepl.called)
    })
    it('should send command to websocket connection when calling `eval`', function() {
        simple.mock(repl.ws, 'send')
        repl.eval('print("hello world")\r')
        assert(repl.ws.send.called)
        assert.equal(repl.ws.send.lastCall.arg, 'print("hello world")\r')
    })
    it('should set internal properties when calling `sendFile`', function(done) {
        simple.mock(repl.ws, 'send', function() {
            assert.equal(repl.sendFileName, filename)
            assert.equal(repl.sendFileData, buffer)
            done()
        })
        let filename = 'foo.py'
        let buffer = new TextEncoder("utf-8").encode('print("hello world!")');
        repl.sendFile(filename, buffer)
    })
    it('should set correct `binaryState` when calling `sendFile`', function(done) {
        simple.mock(repl.ws, 'send', function() {}).callFn(function() {
            assert.equal(repl.binaryState, 11)
            done()
        })
        let filename = 'foo.py'
        let buffer = new TextEncoder("utf-8").encode('print("hello world!")');
        repl.sendFile(filename, buffer)
    })
    it('should get a Uint8Array correctly setup when calling `_getPutBinary`', function() {
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
    it('should send correct binary data when calling `sendFile`', function(done) {
        simple.mock(repl.ws, 'send', function(data) {
            assert.deepEqual(data, repl._getPutBinary(filename, buffer.length))
            done()
        })
        let filename = 'foo.py'
        let buffer = new TextEncoder("utf-8").encode('print("hello world!")');
        repl.sendFile(filename, buffer)
    })



    it('should set internal properties when calling `loadFile`', function(done) {
        simple.mock(repl.ws, 'send', function() {
            assert.equal(repl.getFileName, filename)
            done()
        })
        let filename = 'foo.py'
        repl.loadFile(filename)
    })
    it('should set correct `binaryState` when calling `loadFile`', function(done) {
        simple.mock(repl.ws, 'send', function() {}).callFn(function() {
            assert.equal(repl.binaryState, 21)
            done()
        })
        let filename = 'foo.py'
        repl.loadFile(filename)
    })
    it('should get a Uint8Array correctly setup when calling `_getGetBinary`', function() {
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
    it('should generate and execute code to remove file when calling `removeFile`', function(done) {
        simple.mock(repl, 'execFromString').callFn((data) => {
            let expectedCode = `from os import remove
remove('${filename}')`
            assert.equal(data, expectedCode)
            done()
        })
        let filename = 'foo.py'
        repl.removeFile(filename)
    })
})
