'use strict'

import { LitElement, html, css } from 'lit'

class NoUpdates extends LitElement {
        static properties = {
                text: { type: String }
            }

        constructor () {
                super()
                this.text = 'No updates component'
            }

        render () {
                return html`<div>${this.text}</div>`
            }
    }


NoUpdates.is = 'noupdates-element'

export default NoUpdates