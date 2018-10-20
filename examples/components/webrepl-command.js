class CommandComponent extends HTMLElement {
    constructor() {
        super()
        const shadowRoot = this.attachShadow({mode: 'open'})
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
    render() {
        this.shadowRoot.innerHTML = this.template()
        let commandForm = this.shadowRoot.querySelector('#command')
        commandForm.addEventListener('submit', this.submitHandler.bind(this))
    }
    connectedCallback() {
        this.render()
    }
    get(attr) {
        if(this.hasAttribute(attr)) {
            return this.getAttribute(attr)
        } else {
            return ''
        }
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
