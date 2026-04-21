import { LitElement, html, css } from 'lit'

class App extends LitElement {
        static styles = css`
                :host { display: block; font-family: system-ui, sans-serif; }
                #controls { margin: 10px 0; }
                #controls button { margin-right: 5px; padding: 5px 10px; }
                #result { margin-top: 10px; padding: 10px; background: #e0f0e0; }
        `

        render () {
                return html`
                        <div id="app"></div>
                        <div id="controls">
                                <button id="updateMsg">Update Message</button>
                                <button id="increment">Increment</button>
                                <button id="getCount">Get Count</button>
                                <button id="destroy">Destroy</button>
                        </div>
                        <div id="result">Result: <span id="resultText">-</span></div>
                        <div id="hasResult">Has app: <span id="hasText">-</span></div>
                    `
            }
    }


App.is = 'app-element'

export default App