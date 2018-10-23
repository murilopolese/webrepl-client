import { BaseComponent } from './base-component.js'

class CommandComponent extends BaseComponent {
    constructor() {
        super()
    }
    static get observedAttributes() {
        return ['command', 'connected']
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render()
    }
    template() {
        return `
        <style>
            :host {
                display: block;
            }
            #command {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            #command input {
                font-size: 16px;
                background: inherit;
            }
            #command input[name=command] {
                flex-grow: 2
            }
        </style>
        <form id="command">
            <input type="text" name="command" placeholder="Write Python here!" value="${this.get('command')}">
            <input type="submit" name="send" value="send" ${this.get('connected')?'':'disabled'}>
        </form>
        `
    }
    unbindEvents() {
        let commandForm = this.shadowRoot.querySelector('#command')
        commandForm.removeEventListener('submit', this.submitHandler)
    }
    bindEvents() {
        let commandForm = this.shadowRoot.querySelector('#command')
        commandForm.addEventListener('submit', this.submitHandler.bind(this))
    }
    submitHandler(e) {
        e.preventDefault()
        let commandForm = this.shadowRoot.querySelector('#command')
        this.dispatchEvent(
            new CustomEvent('submit-command', {
                detail: commandForm.command.value
            })
        )
        commandForm.command.value = ''
        return false
    }
}
customElements.define('webrepl-command', CommandComponent)
