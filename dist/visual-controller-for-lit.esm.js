import e from "ask-for-promise";
//#region src/main.js
function t(t = {}) {
	let n = {}, r = {};
	function i(i, o = {}, s) {
		let c = !!n[s], l;
		if (!i) return console.error("Error: Component is undefined"), !1;
		if (c && a(s), l = document.getElementById(s), !l) return console.error(`Can't find node with id: "${s}"`), !1;
		r[s] = {};
		let u, d = e(), f = e(), p = {
			dependencies: t,
			data: o,
			setupUpdates: (e) => r[s] = e
		}, m = i.is || i.tagName || `lit-app-${s}`;
		return customElements.get(m) || customElements.define(m, i), u = document.createElement(m), u.dependencies = p.dependencies, Object.keys(p.data || {}).forEach((e) => {
			u[e] = p.data[e];
		}), u.setupUpdates = p.setupUpdates, l.innerHTML.trim() ? d.done() : l.appendChild(u), n[s] = u, requestAnimationFrame(() => d.done()), d.onComplete(() => f.done(r[s])), f.promise;
	}
	function a(e) {
		if (Object.keys(n).includes(e)) {
			let t = n[e];
			t && t.remove();
			let i = document.getElementById(e);
			return i && (i.innerHTML = ""), delete n[e], delete r[e], !0;
		} else return !1;
	}
	function o(e) {
		return r[e] || (console.error(`App with id: "${e}" was not found.`), !1);
	}
	function s(e) {
		return !!n[e];
	}
	return {
		publish: i,
		destroy: a,
		getApp: o,
		has: s
	};
}
//#endregion
export { t as default };
