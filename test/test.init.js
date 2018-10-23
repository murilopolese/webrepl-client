import { WebREPL } from '../webrepl.js'

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
            autoConnect: false,
            autoAuth: false,
            timeout: 5000
        }
        let repl = new WebREPL()
        assert.equal(repl.ip, defaults.ip)
        assert.equal(repl.password, defaults.password)
        assert.equal(repl.autoConnect, defaults.autoConnect)
        assert.equal(repl.autoAuth, defaults.autoAuth)
        assert.equal(repl.timeout, defaults.timeout)
    })
})
