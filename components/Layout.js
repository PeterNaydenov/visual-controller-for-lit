'use strict'

import { LitElement, html, css } from 'lit'

class Layout extends LitElement {
        static properties = {
                title: { type: String }
            }

        constructor () {
                super()
                this.title = 'Layout element'
            }

        render () {
                return html`
                        <div>${this.title}</div>
                    `
            }
    }


Layout.is = 'layout-element'

export default Layout