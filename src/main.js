"use strict"
/**
 *  Visual Controller for Lit
 *  Controls multiple Lit apps with a single controller.
 * 
 *  History notes:
 *   - Development started on April 20th, 2026
 *   - Published on GitHub for first time: April 20th, 2026
 */



import askForPromise from 'ask-for-promise'

const version = '1.0.0'



/**
 * Configuration options for VisualController
 * @typedef {Object} VisualControllerOptions
 * @property {Object} [dependencies] - Object with dependencies that should be available for all components
 */

/**
 * Methods exposed for external component control
 * @typedef {Object} UpdateMethods
 * @property {Function} [methodName: string] - Any method registered via setupUpdates
 */

/**
 * Props passed to Lit components
 * @typedef {Object} LitComponentProps
 * @property {Object} dependencies - Dependencies provided during VisualController initialization
 * @property {Object} data - Data passed as second argument to publish
 * @property {Function} setupUpdates - Function to register external update methods
 */

/**
 * VisualController return object
 * @typedef {Object} VisualControllerAPI
 * @property {Function} publish - Publish a Lit app
 * @property {Function} destroy - Destroy a Lit app
 * @property {Function} getApp - Get app update methods
 * @property {Function} has - Check if app exists
 */



/**
 * Visual Controller for Lit
 * @param {Object} [dependencies={}] - Dependencies that should be available for all components
 * @returns {VisualControllerAPI} - Object with methods: publish, destroy, getApp, has
 */
function VisualController ( dependencies = {} ) {
        /** @type {Object.<string, any>} */
        const cache = {}  
        /** @type {Object.<string, UpdateMethods>} */
        const updateInterface = {}

    /**
     * Publish a Lit app
     * @param {any} component - Lit component class
     * @param {Object} [data={}] - Data for the Lit component
     * @param {string} id - Id of the container
     * @returns {Promise<UpdateMethods>|boolean}
     */
    function publish  (component, data = {}, id) {
                const hasKey = cache[id] ? true : false;
                let   node;
                
                if ( !component ) {
                        console.error ( `Error: Component is undefined` )
                        return false
                   }
                if ( hasKey )   destroy ( id )
                node = document.getElementById ( id )
                if ( !node ) {  
                            console.error ( `Can't find node with id: "${id}"`)
                            return false
                    }

                updateInterface[id] = {}
                let element;
                const
                      loadTask = askForPromise ()
                    , endTask  = askForPromise ()
                    , setupUpdates = lib =>  updateInterface[id] = lib
                    , props = { dependencies, data, setupUpdates }
                    ;

                const customElementName = component.is      // LitElement static is property
                const tagName = customElementName || component.tagName || `lit-app-${id}`

                if ( !customElements.get(tagName) ) {     // Register if not already
                        customElements.define(tagName, component)
                    }

                element = document.createElement(tagName)

                element.dependencies = props.dependencies

                Object.keys(props.data || {}).forEach( dataKey => {
                        element[dataKey] = props.data[dataKey]
                    })

                element.setupUpdates = props.setupUpdates

                if ( node.innerHTML.trim () ) {   // Hydrate - element already in DOM
                        loadTask.done()      // No async setup needed for hydration
                    }
                else {   // Start a new Lit App
                        node.appendChild(element)
                    }

                cache[id] = element

                requestAnimationFrame(() => loadTask.done() )

                loadTask.onComplete ( () => endTask.done ( updateInterface[id])   )
                return endTask.promise
            } // publish func.


    /**
     * Destroy a Lit app
     * @param {string} id - Id of the container
     * @returns {boolean}
     */
    function destroy (id) {
                const htmlKeys = Object.keys(cache);
                if ( htmlKeys.includes(id) ) {                    
                        let element = cache[id];
                        if ( element ) {
                                element.remove()
                            }
                        let node = document.getElementById(id)
                        if ( node ) {
                                node.innerHTML = ''
                            }
                        delete cache[id]
                        delete updateInterface[id]
                        return true
                    }
                else    return false
            } // destroy func.


            
    /**
     * Get app update methods
     * @param {string} id - Id of the container
     * @returns {UpdateMethods|false}
     */
    function getApp (id) {
                const item = updateInterface[id];
                if ( !item ) {  
                        console.error ( `App with id: "${id}" was not found.`)
                        return false
                    }
                return item
        } // getApp func.


    
    /**
     * Check if app exists
     * @param {string} id - Id of the container
     * @returns {boolean}
     */
    function has ( id ) {
                return cache[id] ? true : false
        } // has func.



    return {
                  publish
                , destroy 
                , getApp  
                , has
            }
} // visualController



export default VisualController