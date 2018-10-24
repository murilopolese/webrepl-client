(function () {
    'use strict';

    Function.prototype.bind||(Function.prototype.bind=function(h){if("function"!==typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var n=Array.prototype.slice.call(arguments,1),r=this,p=function(){},l=function(){return r.apply(this instanceof p&&h?this:h,n.concat(Array.prototype.slice.call(arguments)))};p.prototype=this.prototype;l.prototype=new p;return l});!window.MutationObserver&&window.WebKitMutationObserver&&(window.MutationObserver=window.WebKitMutationObserver);
    if(!window.MutationObserver)throw Error("The CustomElements polyfill requires MutationObserver support. Include the MutationObserver polyfill then include the CustomElements polyfill.");
    (function(){var h={logFlags:{dom:!1}};if(!Boolean(document.register)){var n=function(a){return (a=q(a))?n(a["extends"]).concat([a]):[]},r=function(a,e){e.is&&a.setAttribute("is",e.is);a.removeAttribute("unresolved");if(!Object.__proto__)for(var c=e["native"],d={},f=e.prototype;f!==c&&f!==HTMLUnknownElement.prototype;){for(var m=Object.getOwnPropertyNames(f),k=0,t;t=m[k];k++)d[t]||(Object.defineProperty(a,t,Object.getOwnPropertyDescriptor(f,t)),d[t]=1);f=Object.getPrototypeOf(f);}a.__proto__=e.prototype;
    a.__upgraded__=!0;h.addedSubtree(a);a.createdCallback&&a.createdCallback();return a},p=function(a){if(!a.setAttribute._polyfilled){var e=a.setAttribute;a.setAttribute=function(a,c){l.call(this,a,c,e);};var c=a.removeAttribute;a.removeAttribute=function(a){l.call(this,a,null,c);};a.setAttribute._polyfilled=!0;}},l=function(a,e,c){var d=this.getAttribute(a);c.apply(this,arguments);var f=this.getAttribute(a);this.attributeChangedCallback&&f!==d&&this.attributeChangedCallback(a,d,f);},s={};h.registry=s;var q=
    function(a){if(a)return s[a.toLowerCase()]},v=function(a){return function(){return r(u(a.tag),a)}},u=document.createElement.bind(document),A=Node.prototype.cloneNode;document.register=function(a,e){var c=e||{};if(!a)throw Error("document.register: first argument `name` must not be empty");if(0>a.indexOf("-"))throw Error("document.register: first argument ('name') must contain a dash ('-'). Argument provided was '"+String(a)+"'.");if(q(a))throw Error("DuplicateDefinitionError: a type with name '"+
    String(a)+"' is already registered");if(!c.prototype)throw Error("Options missing required prototype property");c.name=a.toLowerCase();c.lifecycle=c.lifecycle||{};c.ancestry=n(c["extends"]);for(var d=c["extends"],f=0,m;m=c.ancestry[f];f++)d=m.is&&m.tag;c.tag=d||c.name;d&&(c.is=c.name);if(!Object.__proto__){var k=HTMLElement.prototype;c.is&&(k=document.createElement(c.tag),k=Object.getPrototypeOf(k));for(d=c.prototype;d&&d!==k;)f=Object.getPrototypeOf(d),d=d.__proto__=f;}c["native"]=k;p(c.prototype);
    s[c.name]=c;c.ctor=v(c);c.ctor.prototype=c.prototype;c.prototype.constructor=c.ctor;h.addedNode(document);return c.ctor};document.createElement=function(a,e){var c=q(e||a);return c?new c.ctor:u(a)};Node.prototype.cloneNode=function(a){a=A.call(this,a);addedNode(a);return a};h.upgradeElement=function(a){if(!a.__upgraded__&&a.nodeType===Node.ELEMENT_NODE){var e=a.getAttribute("is")||a.localName;return (e=q(e))&&r(a,e)}};}(function(a){function e(b,a,c){var d=b.firstElementChild;if(!d)for(d=b.firstChild;d&&
    d.nodeType!==Node.ELEMENT_NODE;)d=d.nextSibling;for(;d;)!0!==a(d,c)&&e(d,a,c),d=d.nextElementSibling;return null}function c(b,a){e(b,function(b){if(a(b))return !0});}function d(b){var c;a:{if(!b.__upgraded__&&b.nodeType===Node.ELEMENT_NODE&&(c=b.getAttribute("is")||b.localName,a.registry[c])){g.dom&&console.group("upgrade:",b.localName);a.upgradeElement(b);g.dom&&console.groupEnd();c=!0;break a}c=void 0;}if(c)return k(b),!0;l(b);}function f(b){c(b,function(b){if(d(b))return !0});}function m(b){return d(b)||
    f(b)}function k(b){l(b);w(b)&&c(b,function(b){l(b);});}function h(b){x.push(b);y||(y=!0,(window.Platform&&window.Platform.endOfMicrotask||setTimeout)(p));}function p(){y=!1;for(var b=x,a=0,c=b.length,d;a<c&&(d=b[a]);a++)d();x=[];}function l(b){u?h(function(){n(b);}):n(b);}function n(b){if(b.enteredViewCallback||b.__upgraded__&&g.dom)g.dom&&console.group("inserted:",b.localName),w(b)&&(b.__inserted=(b.__inserted||0)+1,1>b.__inserted&&(b.__inserted=1),1<b.__inserted?g.dom&&console.warn("inserted:",b.localName,
    "insert/remove count:",b.__inserted):b.enteredViewCallback&&(g.dom&&console.log("inserted:",b.localName),b.enteredViewCallback())),g.dom&&console.groupEnd();}function r(b){q(b);c(b,function(b){q(b);});}function q(b){u?h(function(){s(b);}):s(b);}function s(b){if(b.leftViewCallback||b.__upgraded__&&g.dom)g.dom&&console.log("removed:",b.localName),w(b)||(b.__inserted=(b.__inserted||0)-1,0<b.__inserted&&(b.__inserted=0),0>b.__inserted?g.dom&&console.warn("removed:",b.localName,"insert/remove count:",b.__inserted):
    b.leftViewCallback&&b.leftViewCallback());}function w(b){for(var a=document;b;){if(b==a)return !0;b=b.parentNode||b.host;}}var g=a.logFlags,u=window.MutationObserver===window.MutationObserverPolyfill,y=!1,x=[],v=new MutationObserver(function(b){if(g.dom){var a=b[0];if(a&&"childList"===a.type&&a.addedNodes&&a.addedNodes){for(a=a.addedNodes[0];a&&a!==document&&!a.host;)a=a.parentNode;var c=a&&(a.URL||a._URL||a.host&&a.host.localName)||"",c=c.split("/?").shift().split("/").pop();}console.group("mutations (%d) [%s]",
    b.length,c||"");}b.forEach(function(a){"childList"===a.type&&(z(a.addedNodes,function(a){a.localName&&m(a);}),z(a.removedNodes,function(a){a.localName&&r(a);}));});g.dom&&console.groupEnd();}),z=Array.prototype.forEach.call.bind(Array.prototype.forEach);a.addedNode=m;a.addedSubtree=f;v.observe(document,{childList:!0,subtree:!0});window.addEventListener("DOMContentLoaded",function(){g.dom&&console.group("upgradeDocument: ",(document.URL||document._URL||"").split("/").pop());m(document);g.dom&&console.groupEnd();});})(h);})();

    class BaseComponent extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            this.render();
        }
        render() {
            try {
                this.unbindEvents();
            } catch(e) {}
            this.shadowRoot.innerHTML = this.template();
            this.bindEvents();
        }
        template() {
            return ''
        }
        unbindEvents() {}
        bindEvents() {}
        get(attr) {
            if(this.hasAttribute(attr)) {
                return this.getAttribute(attr)
            } else {
                return ''
            }
        }
    }

    class ConnectionComponent extends BaseComponent {
        static get observedAttributes() {
            return ['connected', 'ip', 'password']
        }
        attributeChangedCallback(attrName, oldVal, newVal) {
            this.render();
        }
        template() {
            return `
            <style>
                :host {
                  display: block;
                  margin-bottom: 10px;
                  font-size: 16px;
                }
                #connection input {
                    font-size: 16px;
                    background: inherit;
                }
                #connection {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
                #connection input[name=ip],
                #connection input[name=password] {
                    flex-grow: 2;
                }
            </style>
            <form id="connection">
                <input type="text" name="ip" placeholder="ip address" value="${this.get('ip')}">
                <input type="password" name="password" placeholder="password" value="${this.get('password')}">
                <input type="submit" name="connect" value="connect" ${this.get('connected')?'disabled':''}>
            </form>
        `
        }
        unbindEvents() {
            let connectionForm = this.shadowRoot.querySelector('#connection');
            connectionForm.removeEventListener('submit', this.connectHandler);
        }
        bindEvents() {
            let connectionForm = this.shadowRoot.querySelector('#connection');
            connectionForm.addEventListener('submit', this.connectHandler.bind(this));
        }
        connectHandler(e) {
            e.preventDefault();
            let connectionForm = this.shadowRoot.querySelector('#connection');
            this.dispatchEvent(
                new CustomEvent('connect', {
                    detail: {
                        ip: connectionForm.ip.value,
                        password: connectionForm.password.value
                    }
                })
            );
            return false
        }
    }
    customElements.define('webrepl-connection', ConnectionComponent);

    class TerminalComponent extends BaseComponent {
        constructor() {
            super();
            this.log = '';
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
            this.log += msg.replace('\n', '<br>');
            this.render();
        }
    }
    customElements.define('webrepl-terminal', TerminalComponent);

    class CommandComponent extends BaseComponent {
        static get observedAttributes() {
            return ['command', 'connected']
        }
        attributeChangedCallback(attrName, oldVal, newVal) {
            this.render();
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
            let commandForm = this.shadowRoot.querySelector('#command');
            commandForm.removeEventListener('submit', this.submitHandler);
        }
        bindEvents() {
            let commandForm = this.shadowRoot.querySelector('#command');
            commandForm.addEventListener('submit', this.submitHandler.bind(this));
        }
        submitHandler(e) {
            e.preventDefault();
            let commandForm = this.shadowRoot.querySelector('#command');
            this.dispatchEvent(
                new CustomEvent('submit-command', {
                    detail: commandForm.command.value
                })
            );
            commandForm.command.value = '';
            return false
        }
    }
    customElements.define('webrepl-command', CommandComponent);

    // export default function() {
    window.onload = () => {
        console.log('foo');
        // let connectionForm = document.querySelector('webrepl-connection')
        // let commandForm = document.querySelector('webrepl-command')
        // let terminal = document.querySelector('webrepl-terminal')
        // let submitCommad = (e) => {
        //     repl.exec(e.detail)
        // }
        // connectionForm.addEventListener('connect', (e) => {
        //     repl = new WebREPL({
        //         ip: e.detail.ip,
        //         password: e.detail.password,
        //         autoConnect: true,
        //         autoAuth: true
        //     })
        //     repl.on('connected', () => {
        //         connectionForm.setAttribute('connected', true)
        //         commandForm.setAttribute('connected', true)
        //         commandForm.addEventListener('submit-command', submitCommad)
        //     })
        //     repl.on('output', terminal.output.bind(terminal))
        //     repl.on('error', (err) => {
        //         console.log('error')
        //         console.error(err)
        //     })
        //     repl.on('disconnected', (err) => {
        //         connectionForm.setAttribute('connected', false)
        //         commandForm.setAttribute('connected', false)
        //         commandForm.removeEventListener('submit-command', submitCommad)
        //     })
        // })
    };

}());
