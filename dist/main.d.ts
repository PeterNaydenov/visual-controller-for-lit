export default VisualController;
/**
 * Configuration options for VisualController
 */
export type VisualControllerOptions = {
    /**
     * - Object with dependencies that should be available for all components
     */
    dependencies?: any;
};
/**
 * Methods exposed for external component control
 */
export type UpdateMethods = {
    /**
     * : string] - Any method registered via setupUpdates
     */
    methodName?: Function;
};
/**
 * Props passed to Lit components
 */
export type LitComponentProps = {
    /**
     * - Dependencies provided during VisualController initialization
     */
    dependencies: any;
    /**
     * - Data passed as second argument to publish
     */
    data: any;
    /**
     * - Function to register external update methods
     */
    setupUpdates: Function;
};
/**
 * VisualController return object
 */
export type VisualControllerAPI = {
    /**
     * - Publish a Lit app
     */
    publish: Function;
    /**
     * - Destroy a Lit app
     */
    destroy: Function;
    /**
     * - Get app update methods
     */
    getApp: Function;
    /**
     * - Check if app exists
     */
    has: Function;
};
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
declare function VisualController(dependencies?: any): VisualControllerAPI;
