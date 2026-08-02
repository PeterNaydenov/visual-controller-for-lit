import { LitElement, html, css } from 'lit'

class Sidebar extends LitElement {
    static properties = {
        message: { type: String },
        count:   { type: Number  }
    }

    static styles = css`
        .sidebar {
            padding: 10px;
            background: #e8f0ff;
            border-radius: 4px;
            margin-top: 10px;
        }
        .sidebar h2 { margin: 0 0 10px; }
        .sidebar button { margin-right: 5px; }
    `

    constructor () {
        super()
        this.message = 'Sidebar'
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
            <div class="sidebar">
                <h2>${this.message}</h2>
                <p>Count: ${this.count}</p>
                <button @click=${() => { this.count++; this.requestUpdate() }}>Increment</button>
            </div>
        `
    }
}

Sidebar.is = 'sidebar-element'

export default Sidebar
