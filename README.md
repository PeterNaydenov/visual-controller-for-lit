# Visual Controller for Lit (@peter.naydenov/visual-controller-for-lit)

![version](https://img.shields.io/github/package-json/v/peterNaydenov/visual-controller-for-lit)
![license](https://img.shields.io/github/license/peterNaydenov/visual-controller-for-lit)


Tool for building a micro-frontends(MFE) based on Lit components - Start multiple Lit applications in the same HTML page and control them.

Install visual controller:
```
npm i @peter.naydenov/visual-controller-for-lit
```

Initialization process:
```js
// for es6 module projects:
import notice from '@peter.naydenov/notice' // event emitter by your personal choice.
import VisualController from '@peter.naydenov/visual-controller-for-lit'


let 
      eBus = notice ()
    , dependencies = { eBus }  // Provide everything that should be exposed to components 
    , html = new VisualController ( dependencies ) 
    ;
// Ready for use...
```

Let's show something on the screen:
```js
// Let's have Lit component 'Hello' with prop 'greeting'

html.publish ( Hello, {greeting:'Hi'}, 'app' )
//arguments are: ( component, props, containerID )
```

## Inside of the Components

*Note: If your component should be displayed only, that section can be skipped.*

All provided libraries during visualController initialization are available through `this.dependencies`. Use `this.setupUpdates` if you need to manipulate component from outside.

```js
class Hello extends LitElement {
        static properties = {
                message: { type: String }
            }

        constructor () {
                super()
                this.message = 'Hello'
            }

        connectedCallback () {
                super.connectedCallback()
                const { setupUpdates, dependencies } = this
                // dependencies are available here
                const { eBus } = dependencies

                if (setupUpdates) {
                        this.setupUpdates({
                                changeMessage (update) {
                                        this.message = update
                                        this.requestUpdate()
                                    }
                            })
                    }
            }

        render () {
                return html`<h1>${this.message}</h1>`
            }
    }


Hello.is = 'hello-element'
```

The external call will look like this:

```js
html.getApp ( 'app' ).changeMessage ( 'New message content' )
```



## Visual Controller Methods
```js
  publish : 'Render Lit app in container. Associate app instance with the container.'
, getApp  : 'Returns app instance by container name'
, destroy : 'Destroy app by using container name '
, has     : 'Checks if app with specific "id" was published'
```



### VisualController.publish ()
Publish a Lit app.
```js
html.publish ( component, props, containerID )
```
- **component**: *class*. Lit component class
- **props**: *object*. Lit components properties
- **containerID**: *string*. Id of the container where Lit-app will live.
- **returns**: *Promise<Object>*. Update methods library if defined. Else will return an empty object;

Example:
```js
 let html = new VisualController ();
 html.publish ( Hi, { greeting: 'hi'}, 'app' )
```

Render component 'Hi' with prop 'greeting' and render it in html element with id "app".





### VisualController.getApp ()
Returns the library of functions provided from method `setupUpdates`. If Lit-app never called `setupUpdates`, result will be an empty object.

```js
 let controls = html.getApp ( containerID )
```
- **containerID**: *string*. Id of the container.

Example:
```js
let 
      id = 'videoControls'
    , controls = html.getApp ( id )
    ;
    // if app with 'id' doesn't exist -> returns false, 
    // if app exists and 'setupUpdates' was not used -> returns {}
    // in our case -> returns { changeMessage:f }
if ( !controls )   console.error ( `App for id:"${id}" is not available` )
else {
        if ( controls.changeMessage )   controls.changeMessage ('new title') 
   }
```
If visual controller(html) has a Lit app associated with this name will return it. Otherwise will return **false**.




### VisualController.has ()
Checks if app with specific "id" was published.

```js
 const has = html.has ( containerID )
```
- **containerID**: *string*. Id of the container.
- **returns**: *boolean*. Returns true if app with specific id exists, false otherwise




### VisualController.destroy ()
Will destroy Lit app associated with this container name and container will become empty. Function will return 'true' on success and 'false' on failure. 
Function will not delete content of provided container if there is no Lit app associated with it.

```js
html.destroy ( containerID )
```
- **containerID**: *string*. Id name.






### Extra

Visual Controller has versions for few other front-end frameworks:
- [Vue 3](https://github.com/PeterNaydenov/visual-controller-for-vue3)
- [React](https://github.com/PeterNaydenov/visual-controller-for-react)
- [Svelte 5](https://github.com/PeterNaydenov/visual-controller-for-svelte5)
- [Solid](https://github.com/PeterNaydenov/visual-controller-for-solid)
- [Preact](https://github.com/PeterNaydenov/visual-controller-for-preact)
- [Vue 2](https://github.com/PeterNaydenov/visual-controller-for-vue)
- [Svelte 3 and 4](https://github.com/PeterNaydenov/visual-controller-for-svelte3)



## Links

- [History of changes](https://github.com/PeterNaydenov/visual-controller-for-lit/blob/master/Changelog.md)
- [License](https://github.com/PeterNaydenov/visual-controller-for-lit/blob/master/LICENSE)



## Credits
'visual-controller-for-lit' is created and supported by Peter Naydenov



## License

'visual-controller-for-lit' is released under the [MIT license](https://github.com/PeterNaydenov/visual-controller-for-lit/blob/master/LICENSE)