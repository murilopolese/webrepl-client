import { BaseComponent } from './base-component.js'

class FileManagerComponent extends BaseComponent {
    constructor() {
        super()
        this.files = []
    }
    static get observedAttributes() {
        return ['connected']
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
            #controls[disabled] * {
                pointer-events:none;
                cursor: not-allowed;
                opacity: 0.5;
            }
            #controls {
                display: flex;
                flex-direction: column;
            }
            #controls > div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            #controls input {
                font-size: 16px;
                background: inherit;
            }
            #controls > div input[name=filename] {
                flex-grow: 2
            }
        </style>
        <form id="controls" ${this.get('connected')?'':'disabled'}>
            <div>
                <input type="button" name="list" value="list files">
                <input type="file" name="filePicker">
                <input type="button" name="send" value="send">
            </div>
            <div>
                <input type="text" name="filename" placeholder="filename">
                <input type="button" name="get" value="get">
                <input type="button" name="remove" value="remove">
            </div>
        </form>
        <div class="files">${this.files.join(`<br>`)}</div>
        `
    }
    bindEvents() {
        let controlsForm = this.shadowRoot.querySelector('#controls')
        let listBtn = controlsForm.list
        let sendBtn = controlsForm.send
        let removeBtn = controlsForm.remove
        let getBtn = controlsForm.get
        controlsForm.addEventListener('submit', this.submitHandler.bind(this))
        listBtn.addEventListener('click', this.handleList.bind(this))
        sendBtn.addEventListener('click', this.handleSend.bind(this))
        removeBtn.addEventListener('click', this.handleRemove.bind(this))
        getBtn.addEventListener('click', this.handleGet.bind(this))
    }
    unbindEvents() {
        let controlsForm = this.shadowRoot.querySelector('#controls')
        let listBtn = controlsForm.list
        let sendBtn = controlsForm.send
        let removeBtn = controlsForm.remove
        let getBtn = controlsForm.get
        controlsForm.removeEventListener('submit', this.submitHandler)
        listBtn.removeEventListener('click', this.handleList)
        sendBtn.removeEventListener('click', this.handleSend)
        removeBtn.removeEventListener('click', this.handleRemove)
        getBtn.removeEventListener('click', this.handleGet)
    }
    submitHandler(e) {
        e.preventDefault()
        return false
    }
    handleList(e) {
        this.dispatchEvent(new CustomEvent('list-files'))
    }
    handleSend(e) {
        let controlsForm = this.shadowRoot.querySelector('#controls')
        this.dispatchEvent(
            new CustomEvent('send-file', {
                detail: controlsForm.filePicker.files[0]
            }
        ))
    }
    handleRemove(e) {
        let controlsForm = this.shadowRoot.querySelector('#controls')
        this.dispatchEvent(
            new CustomEvent('remove-file', {
                detail: controlsForm.filename.value
            }
        ))
    }
    handleGet(e) {
        let controlsForm = this.shadowRoot.querySelector('#controls')
        this.dispatchEvent(
            new CustomEvent('get-file', {
                detail: controlsForm.filename.value
            }
        ))
    }
    loadFiles(files) {
        this.files = files
        this.render()
    }
}
customElements.define('webrepl-file-manager', FileManagerComponent)
