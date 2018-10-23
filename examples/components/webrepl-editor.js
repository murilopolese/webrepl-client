import { BaseComponent } from './base-component.js'

class EditorComponent extends BaseComponent {
    static get observedAttributes() {
        return ['connected', 'code']
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render()
    }
    template() {
        return `
            <style>
                :host {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                #toolbar[disabled] * {
                    pointer-events:none;
                    cursor: not-allowed;
                    opacity: 0.5;
                }
                #toolbar {
                    margin-bottom: 10px;
                }
                #editor {
                    font-size: 16px;
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
            <div id="toolbar" ${this.get('connected')?'':'disabled'}>
                <button id="run">Run</button>
                <button id="stop">Stop</button>
            </div>
            <textarea id="editor">${this.get('code')}</textarea>
        `
    }
    bindEvents() {
        let runBtn = this.shadowRoot.querySelector('#run')
        let stopBtn = this.shadowRoot.querySelector('#stop')
        runBtn.addEventListener('click', this.handleRun.bind(this))
        stopBtn.addEventListener('click', this.handleStop.bind(this))
    }
    unbindEvents() {
        let runBtn = this.shadowRoot.querySelector('#run')
        let stopBtn = this.shadowRoot.querySelector('#stop')
        runBtn.removeEventListener('click', this.handleRun)
        stopBtn.removeEventListener('click', this.handleStop)
    }
    handleRun() {
        let editor = this.shadowRoot.querySelector('#editor')
        this.dispatchEvent(
            new CustomEvent('run', { detail: editor.value })
        )
    }
    handleStop() {
        let editor = this.shadowRoot.querySelector('#editor')
        this.dispatchEvent(new CustomEvent('stop'))
    }
}

customElements.define('webrepl-editor', EditorComponent)
