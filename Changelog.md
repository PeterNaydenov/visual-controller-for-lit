# Release History



## 2.0.3 (2026-10-27)
- [x] **Fix: TypeScript consumers could not resolve the package types at all.** `package.json#exports` had no `types` condition, so TypeScript ignored the top-level `"types"` field and every consumer using `moduleResolution: node16`, `nodenext` or `bundler` got `TS2307: Cannot find module '@peter.naydenov/visual-controller-for-lit'`. The `exports` map now points each condition at its own declaration file — `dist/index.d.ts` for `import`, `dist/index.d.cts` for `require`.
- [x] **Fix: `new VisualController()` did not type-check** (`TS7009: 'new' expression, whose target lacks a construct signature`). TypeScript's declaration emit for a JSDoc function is always `declare function X(...)` — a call signature with no construct signature — and a JSDoc type literal cannot express `new (...)` either, so the documented usage failed for every TypeScript consumer. A new type-only entry (`src/index.ts` → `dist/index.d.ts`) declares the default export with both a call signature and a construct signature. Both forms work at runtime — `VisualController` returns the instance object, and a constructor returning an object hands that object back.
- [x] **Fix: `SetupUpdates` was typed as `Object`**, which made `html.getApp('header').changeMessage('...')` a type error. It is now `Record<string, any>`, so component-provided methods are reachable without a cast.
- [x] CommonJS declarations (`dist/main.d.cts`, `dist/index.d.cts`) are generated next to the ESM ones, so `require()` consumers get types as well (`TS1479` otherwise).
- [x] Fix: `vite.config.js` used `__dirname`, which Vite 8 warns about because the native config loader does not support it. Switched to `import.meta.dirname`.
- [x] Removed the vestigial `ignoreDeprecations` option from `tsconfig.types.json`.


## 2.0.2 (2026-10-24)
- [x] Dependencies update. Ask-for-promise 3.2.1;



## 2.0.1 (2026-08-09)
- [x] Fix: Package locations for ESM, CJS, and UMD;



## 2.0.0 (2026-08-02)
- [x] **Breaking change.** Region-based API. The v1 `id`-based API (`publish(component, data, id)` etc.) is removed. Regions are defined with the inlined dim subset (see `src/dim.js`) via the new `set` method, which mirrors `dim.set` exactly.
- [x] New API: `set`, `publish(alias, component, data?, extraParams?)`, `destroy`, `has`, `getApp`, `isEmpty`, `list`, `reset`.
- [x] Multiple placeholders can coexist inside a single parent without DOM `id` collisions — selection is by alias returned from the `set` callback.
- [x] Destroying an app empties the region but keeps the markers, so the same alias can host a different app later.
- [x] Mount container is a bare `<span style="display:contents">` — invisible to layout, no DOM wrapper authored by the user.
- [x] SSR hydration preserved: when the range already contains content at publish time, the controller picks it as the mount target (single element → direct mount, multiple siblings → wrapped in a mount span).
- [x] `isEmpty(alias)` delegates to the inlined dim's `range.isEmpty()` — returns `true` for collapsed or orphaned ranges, `undefined` for unknown aliases.
- [x] `destroy()` is polymorphic — accepts no argument (destroys every published app, returns count), an alias string, or an array of alias strings. Markers stay in the DOM in every form.
- [x] No `@peter.naydenov/dim` dependency. The slim subset of dim the controller uses is inlined in `src/dim.js`. The file header documents the upstream reference for syncing if the official package changes.
- [x] `extraParams` slot accepted but ignored — reserved for future use.



## 1.0.2 (2026-07-23)
- [x] Dependencies update. Ask-for-promise 3.2.0;
- [x] Typescript v.7.0.2;



## 1.0.1 (2026-05-27)
- [x] Dependencies update. Ask-for-promise 3.1.1;
- [x] Lit was added as a dev dependency;



## 1.0.0 (2026-04-21)
- [x] Initial release;
- [x] Visual Controller API for Lit components;
- [x] Support for SSR hydration;
- [x] JSDoc types generation;
- [x] Typescript support;
- [x] Build scripts for ESM, CJS, and UMD;
- [x] Test coverage with Vitest;