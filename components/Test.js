'use strict'

import { LitElement, html, css } from 'lit'

class Test extends LitElement {
        static properties = {
                text: { type: String },
                count: { type: Number }
            }

        static styles = css`
                :host { display: block; }
            `

        constructor () {
                super()
                this.text = 'Test element'
                this.count = 0
            }

        connectedCallback () {
                super.connectedCallback()
                if (this.setupUpdates) {
                        this.setupUpdates({
                                setupText: x => {
                                        this.text = x
                                        this.requestUpdate()
                                    }
                            })
                    }
            }

        debug () {
                this.count = 12
                this.requestUpdate()
            }

        render () {
                return html`
                        <div id="ins" @click=${this.debug}>${this.text}</div>
                        <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                            Molestiae repudiandae ullam architecto, exercitationem, 
                            repellendus ratione atque blanditiis magni, mollitia sunt 
                            temporibus! Eaque voluptatem dignissimos consequatur vitae 
                            perspiciatis praesentium dolores totam eum earum, labore, 
                            saepe tenetur. Inventore aliquam excepturi non assumenda!
                            </p>
                        <p id="count">Count: ${this.count}</p>
                    `
            }
    }


Test.is = 'test-element'

export default Test