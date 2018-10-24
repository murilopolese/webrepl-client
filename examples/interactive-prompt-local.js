import '../node_modules/custom-elements/dist/CustomElements.min.js'

import './components/webrepl-connection.js'
import './components/webrepl-terminal.js'
import './components/webrepl-command.js'
import { WebREPL } from '../webrepl.js'
let repl

window.onload = () => {
    let connectionForm = document.querySelector('webrepl-connection')
    let commandForm = document.querySelector('webrepl-command')
    let terminal = document.querySelector('webrepl-terminal')
    let submitCommad = (e) => {
        repl.exec(e.detail)
    }
    connectionForm.addEventListener('connect', (e) => {
        repl = new WebREPL({
            ip: e.detail.ip,
            password: e.detail.password,
            autoConnect: true,
            autoAuth: true
        })
        repl.on('connected', () => {
            connectionForm.setAttribute('connected', true)
            commandForm.setAttribute('connected', true)
            commandForm.addEventListener('submit-command', submitCommad)
        })
        repl.on('output', terminal.output.bind(terminal))
        repl.on('error', (err) => {
            console.log('error')
            console.error(err)
        })
        repl.on('disconnected', (err) => {
            connectionForm.setAttribute('connected', false)
            commandForm.setAttribute('connected', false)
            commandForm.removeEventListener('submit-command', submitCommad)
        })
    })
}
