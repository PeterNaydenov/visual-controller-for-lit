# Visual Controller for Lit (@peter.naydenov/visual-controller-for-lit)

![version](https://img.shields.io/github/package-json/v/peterNaydenov/visual-controller-for-lit)
![license](https://img.shields.io/github/license/peterNaydenov/visual-controller-for-lit)


Run multiple Lit apps on the same page from a single controller. Each app gets its own region defined by invisible markers — **no DOM ids, no wrapper elements, no `getElementById` calls**.

```js
import VisualController from '@peter.naydenov/visual-controller-for-lit'
import HeaderApp   from './header.js'
import SidebarApp  from './sidebar.js'
import CartApp     from './cart.js'

const html = new VisualController({ /* shared dependencies */ })

// Place markers anywhere in the DOM. Whatever string the callback returns
// becomes the alias. Multiple regions can share a parent.
html.set(({ start, end }) => { document.querySelector('header').append(start, end); return 'header'  })
html.set(({ start, end }) => { document.querySelector('aside' ).append(start, end); return 'sidebar' })
html.set(({ start, end }) => { document.querySelector('main'  ).append(start, end); return 'cart'    })

// Publish apps into the regions.
html.publish('header',  HeaderApp)
html.publish('sidebar', SidebarApp)
html.publish('cart',    CartApp)
```

Each `publish` is independent — apps can be added, removed, swapped, or destroyed at runtime. Each app gets access to the same shared dependencies (event buses, stores, services) via the `dependencies` object passed to the controller.

> **v2.0.0 — breaking change.** The v1 `id`-based API is removed. v2 is region-only. See [Migration from v1](#migration-from-v1) if you're upgrading.



## Why use this

Most pages need more than one Lit app — a header from team A, a sidebar from team B, a checkout widget from team C. The challenge is coordinating them without coupling.

The marker model is what makes this library simple. Instead of authoring `<div id="app">` and looking it up with `document.getElementById('app')`, you place invisible markers directly in the DOM and the controller finds them by alias:

```js
// v1: tag the element, look it up, pass the id
<div id="app"></div>
html.publish(MyComponent, props, 'app')

// v2: place markers, return the alias — no DOM id, no wrapper
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'app'
})
html.publish('app', MyComponent, props)
```

The nesting of `set` and `publish` looks like extra steps, but the payoff is that the controller owns the location. No ids to manage, no collisions, no wrapper elements. The HTML author doesn't need to know which app will live where — they just write `<main>` and the JS declares the regions.

The dynamic lifecycle is the other half:

```js
// Swap apps in a region without touching the DOM
html.publish('header', HeaderApp)        // first app
html.publish('header', PromoBannerApp)   // same alias, different app
html.destroy('header')                   // markers stay, region is empty
html.publish('header', HeaderApp)        // re-publish
```

Same parent, multiple regions, no DOM ids, no wrapper elements.



## Quick start

```js
import VisualController from '@peter.naydenov/visual-controller-for-lit'
import HeaderApp  from './header.js'
import SidebarApp from './sidebar.js'

const html = new VisualController({ /* dependencies */ })

// 1. Define regions. Each callback receives { start, end } markers
//    (invisible text nodes) and must attach both to the DOM.
//    Whatever string the callback returns becomes the alias.
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'sidebar'
})

// 2. Publish apps into regions.
html.publish('header',  HeaderApp,  { greeting: 'Hi!' })
html.publish('sidebar', SidebarApp)
```

```html
<main id="main">
    <h2>Static page heading</h2>
    <!-- regions are placed by the JS above. No <div id="..."> wrappers. -->
</main>
```

The same parent (`#main`) hosts two regions with no `id` collisions. Selection is by alias, not by DOM lookup.

> The marker model is the same one used by [`@peter.naydenov/dim`](https://github.com/PeterNaydenov/dim). A slim inlined subset of dim lives in `src/dim.js` (no separate install). See that file's header for the upstream reference.



## API

```js
  set     : 'Define a region by placing markers in the DOM'
, publish : 'Mount a Lit app into a region by alias'
, destroy : 'Unmount the app(s); empty the range(s); keep the markers'
, has     : 'Is an app currently published in this region?'
, getApp  : 'Returns the setupUpdates interface for a published app'
, isEmpty : 'Is the region empty (no content between markers)?'
, list    : 'Returns every alias registered via set'
, reset   : 'Unmount all apps, clear internal state, remove the markers'
```



### `html.set(fn, ...args)`

Define a region. The callback receives `{ start, end }` text-node markers and must attach both to the DOM. Whatever string the callback returns becomes the alias used by all other methods.

```js
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

// Extra args are forwarded to the callback.
html.set(({ start, end }, locale) => {
    // ...
    return 'l10n-header'
}, 'en')
```

The placement is entirely up to you — anywhere the markers can be inserted. Multiple regions can live inside the same parent. Markers stay where you put them for the lifetime of the page (or until `reset()`).



### `html.publish(alias, component, data?, extraParams?)`

Mount a Lit app into a region. The controller resolves a tag name from the component (via `component.is`, `component.tagName`, or a generated fallback), inserts a `<span style="display:contents">` between the markers, instantiates the element, and tracks it under the alias.

| Arg | Required | Default | Description |
| --- | --- | --- | --- |
| `alias` | yes | — | Region alias (returned from `set`). |
| `component` | yes | — | A Lit component class (extends `LitElement`). |
| `data` | no | `{}` | Component properties. Each key is assigned to the element instance. |
| `extraParams` | no | `{}` | Reserved for future use. Accepted, ignored. |

Returns a `Promise` resolving to the `setupUpdates` object, or `false` on error.

```js
// Bare minimum
html.publish('header', MyComponent)

// With props
html.publish('header', MyComponent, { greeting: 'Hi!' })

// All four
html.publish('header', MyComponent, { greeting: 'Hi!' }, { /* future */ })
```

Calling `publish` for an alias that already has a published app silently destroys the old one first, then mounts the new one. Same alias, different component, same location.

The controller picks the tag name in this order:
1. `component.is` — the conventional Lit pattern (`Hello.is = 'hello-element'`).
2. `component.tagName` — fallback.
3. A generated `lit-app-<alias>-<random>` string — last resort.

If the tag is not already registered, the controller calls `customElements.define` for you. Components must therefore be valid custom-element classes (extend `LitElement`, use a hyphenated tag name).



### `html.destroy(target?)`

Unmount the app published in a region and empty the range. Markers stay in the DOM, so the alias can be `publish`-ed again later.

```js
html.destroy('header')                  // → true / false
html.destroy()                          // → count of apps destroyed across all aliases
html.destroy(['header', 'sidebar'])     // → count of those actually destroyed
```

Three forms:

- **`destroy(alias)`** — single alias string. Returns `true` on success, `false` if the alias has no published app.
- **`destroy()`** — no args. Destroys every published app across all aliases. Returns the count of apps destroyed.
- **`destroy(aliases)`** — array of alias strings. Destroys each; missing aliases are silently skipped. Returns the count actually destroyed.

**What `destroy()` touches:** the Lit element (detaches from DOM), the mount span (removes from DOM), and the cache entry (so `has(alias)` is `false`). **What `destroy()` does NOT touch:** the markers (stay in the DOM), the alias in `list()` (stays registered, can be re-published), or the dim registry (no re-`set()` needed).

For a full cleanup that also removes markers, use `reset()`.



### `html.has(alias)`

Returns `true` if an app is currently published in this region, `false` otherwise. Empty regions (markers exist but no app published) return `false`.

```js
html.has('header')   // → boolean
```



### `html.getApp(alias)`

Returns the `setupUpdates` object provided from inside the published component, or `false` if the alias has no published app.

```js
const app = html.getApp('header')
if (app)   app.changeMessage('New value')
else       console.error('App not published')
```



### `html.isEmpty(alias)`

Is the region empty (no content between its markers)? Returns `true` if the range is collapsed (empty) **or** if the markers are orphaned (no longer in the DOM). Returns `undefined` for an unknown alias and logs an error.

```js
html.isEmpty('header')   // → true / false / undefined
```

Useful for pre-publish checks: `if (html.isEmpty('header')) await html.publish(...)`. After `destroy`, the range is empty again (markers stay, app gone), so `isEmpty` returns `true`.



### `html.list()`

Returns an array of every alias registered via `set`, regardless of whether each region currently has a published app. Cleared by `reset()`.

```js
html.list()   // → ['header', 'sidebar']
```



### `html.reset()`

Unmounts every published app, clears internal state, and removes every marker from the DOM. After `reset()`, the aliases are gone and the regions must be re-created with `set()` before publishing again.

```js
html.reset()
```



## Inside a component

If your component needs access to external libraries, read them from `this.dependencies`. Everything passed to the `VisualController` constructor is available, plus a `setupUpdates` method that registers an interface for external component manipulation.

```js
import { LitElement, html, css } from 'lit'

class Hello extends LitElement {
    static properties = {
        message: { type: String },
        count:   { type: Number  }
    }

    static styles = css`
        .hello { padding: 10px; background: #f0f0f0; border-radius: 4px; }
        .hello h2 { margin: 0 0 10px; }
    `

    constructor () {
        super()
        this.message = 'Hello from Lit!'
        this.count   = 0
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
```

External access goes through the alias:

```js
const updates = html.getApp('header')
updates.changeMessage('New message content')
updates.increment()
updates.getCount()   // → 1
```

Component props are accepted as the third argument to `publish`. Each key is assigned to the element instance, so declare it in `static properties` and it will react like any Lit property:

```js
html.publish('header', Hello, { message: 'Hi!', count: 0 })
```



## Other details



### SSR hydration

When you pre-populate a region with HTML (server-rendered or static markup), `publish` detects it and hydrates the existing DOM in place. No configuration needed.

```js
// Render on the server, then drop the HTML into the region
const ssrHtml = await renderToString(Hello)

html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

// Manually insert the SSR HTML between the markers
const tmpl = document.createElement('template')
tmpl.innerHTML = ssrHtml
document.querySelector('#main').insertBefore(tmpl.content.firstElementChild, /* end marker */)

// Publish — will hydrate the SSR HTML instead of replacing it
await html.publish('header', Hello)
```

Three cases:

- **Empty range** → controller inserts a `<span style="display:contents">` and instantiates the element into it.
- **Single element between markers** → uses that element as the mount target directly. The element is upgraded in place.
- **Multiple sibling nodes between markers** (fragment template) → wraps them in a `<span style="display:contents">` and mounts the wrapper.

If the SSR HTML doesn't match the component's template, the browser logs a standard hydration warning. The controller does not silence it.



### Custom-element tag resolution

The controller auto-derives the tag name from the component class. The conventional Lit pattern is to set a static `is` field on the class:

```js
Hello.is = 'hello-element'
```

This is what the controller reads first. If `is` is not set, it falls back to `component.tagName`, and finally to a generated `lit-app-<alias>-<random>` string. The tag is registered exactly once via `customElements.define`; subsequent components with the same tag are reused.



## Development

Setup and common commands:

```bash
npm install
npm test         # run the test suite
npm run cover    # coverage report
npm run types    # regenerate dist/main.d.ts from JSDoc
npm run build    # build + regenerate types
npm run dev      # run the demo at http://localhost:5173/
```

Source layout:

| Path | Purpose |
| --- | --- |
| `src/main.js` | The controller. ~250 lines including JSDoc. |
| `src/dim.js` | Slim inlined subset of the dim marker model. ~120 lines. |
| `test/01_controller.test.js` | Test suite. |
| `components/` | Lit components used by tests. |
| `demo/` | Runnable demo. |
| `index.html` | Entry point for `npm run dev`. |
| `dist/` | Build artifacts (committed for npm publishing). |



#### Adding a new method

1. Add the function to `src/main.js` with JSDoc.
2. Export it from the `return { ... }` block at the bottom.
3. Add it to the `VisualControllerInstance` typedef near the top.
4. Add tests in `test/01_controller.test.js`.
5. Update the README's API table and section.
6. Add a bullet to `Changelog.md` under the current version.



#### Keeping the inlined dim in sync

The dim model is owned by the official `@peter.naydenov/dim` package. If the upstream API changes, diff `src/dim.js` against the reference implementation (see the file header for the GitHub URL) and update the inlined subset to match. The methods used by the controller are `set`, `get`, `reset`, `aliases`, and the range's `isEmpty`.



## Migration from v1

The v1 API was id-based: HTML authors wrote `<div id="app">`, the controller looked it up with `document.getElementById`, and `publish` took the id as its third argument.

```js
// v1 (removed in v2)
<div id="app"></div>
html.publish(MyComponent, props, 'app')
```

In v2 the controller no longer touches DOM ids. Regions are declared with `set`, and `publish` takes the alias as its first argument:

```js
// v2
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'app'
})
html.publish('app', MyComponent, props)
```

Summary of the migration:

- **Region-based API.** `<div id="...">` placeholders replaced by `set(callback) + alias`.
- **`publish` arg order reshuffled.** Alias first, component second.
- **New methods:** `isEmpty`, `list`, `reset`.
- **Removed:** `containerID` parameter on `publish` / `destroy` / `has` / `getApp`.
- **No `<marker-model>` dependency at install time.** The slim subset the controller uses is inlined in `src/dim.js`. See the file header for the upstream reference.

A full migration guide with code comparisons will be added in `Migration.guide.md` alongside the v2.0.0 release.



## Extra

Visual Controller has versions for other front-end frameworks:

- [Vue 3](https://github.com/PeterNaydenov/visual-controller-for-vue3)
- [React](https://github.com/PeterNaydenov/visual-controller-for-react)
- [Svelte 5](https://github.com/PeterNaydenov/visual-controller-for-svelte5)
- [Preact](https://github.com/PeterNaydenov/visual-controller-for-preact)
- [Solid](https://github.com/PeterNaydenov/visual-controller-for-solid)
- [Vue 2](https://github.com/PeterNaydenov/visual-controller-for-vue)
- [Svelte 3 and 4](https://github.com/PeterNaydenov/visual-controller-for-svelte3)



## Links

- [History of changes](https://github.com/PeterNaydenov/visual-controller-for-lit/blob/master/Changelog.md)
- [License](https://github.com/PeterNaydenov/visual-controller-for-lit/blob/master/LICENSE)



## Credits

'visual-controller-for-lit' is created and supported by Peter Naydenov.



## License

'visual-controller-for-lit' is released under the [MIT license](https://github.com/PeterNaydenov/visual-controller-for-lit/blob/master/LICENSE)
