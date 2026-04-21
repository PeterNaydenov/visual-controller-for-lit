import { LitElement, html, css } from 'lit'

class Hello extends LitElement {
        static properties = {
                message: { type: String },
                count: { type: Number }
            }

        static styles = css`
                .hello { padding: 10px; background: #f0f0f0; border-radius: 4px; }
                .hello h2 { margin: 0 0 10px; }
                .hello button { margin-right: 5px; }
            `

        constructor () {
                super()
                this.message = 'Hello'
                this.count = 0
            }

        connectedCallback () {
                super.connectedCallback()
                const { setupUpdates } = this
                if (setupUpdates) {
                        this.setupUpdates({
                                changeMessage: (newMsg) => {
                                        this.message = newMsg
                                        this.requestUpdate()
                                    },
                                increment: () => {
                                        this.count++
                                        this.requestUpdate()
                                    },
                                getCount: () => this.count
                            })
                    }
            }

        render () {
                return html`
                        <div class="hello">
                                <h2>${this.message}</h2>
                                <p>Count: ${this.count}</p>
                                <button @click=${() => { this.count++; this.requestUpdate() }}>Increment</button>
                        </div>
                    `
            }
    }


Hello.is = 'hello-element'

export default Hello