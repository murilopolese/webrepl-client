import { BaseComponent } from './base-component.js'

class TerminalComponent extends BaseComponent {
    constructor() {
        super()
        this.log = ''
    }
    static get observedAttributes() {
        return []
    }
    template() {
        return `
        <style>
            :host {
              display: block;
              margin-bottom: 10px;
              font-size: 16px;
            }
            #console {
                font-family: monospace;
                color: #ccc;
                background: #333;
                width: 100%;
                height: 50vh;
                margin-bottom: 10px;
                overflow-y: scroll;
                overflow-x: auto;
            }
        </style>
        <div id="console">
            Disconnected MicroPython WebREPL <br>
            ${this.log}
        </div>
        `
    }
    output(msg) {
        this.log += msg.replace('\n', '<br>')
        this.render()
    }
}
customElements.define('webrepl-terminal', TerminalComponent)
