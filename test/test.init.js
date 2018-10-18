describe('Initialization', function() {
    beforeEach(function() {
        simple.restore()
    })
    it('shouldn\'t require any arguments', function() {
        let repl = new WebREPL()
    })
    it('should initialize with default values', function() {
        let defaults = {
            ip: '192.168.4.1',
            password: 'micropythoN',
            sendFileName: '',
            sendFileData: new ArrayBuffer(),
            getFileName: '',
            getFileData: new ArrayBuffer(),
            autoconnect: undefined
        }
        let repl = new WebREPL()
        assert.equal(repl.ip, defaults.ip)
        assert.equal(repl.password, defaults.password)
        assert.equal(repl.sendFileName, defaults.sendFileName)
        assert.instanceOf(repl.sendFileData, ArrayBuffer)
        assert.deepEqual(repl.sendFileData, defaults.sendFileData)
        assert.equal(repl.getFileName, defaults.getFileName)
        assert.deepEqual(repl.getFileData, defaults.getFileData)
        assert.instanceOf(repl.getFileData, ArrayBuffer)
        assert.equal(repl.autoconnect, defaults.autoconnect)
    })
    it('should call `connect` if `autoconnect` is true', function() {
        simple.mock(WebREPL.prototype, 'connect')
        simple.mock(window, 'WebSocket', function() {})
        let repl = new WebREPL({ autoconnect: true })
        assert(repl.connect.called)
    })
    it('shouldn\'t call `connect` if `autoconnect` is false', function() {
        simple.mock(WebREPL.prototype, 'connect')
        let repl = new WebREPL({ autoconnect: false })
        assert(!repl.connect.called)
    })
})
