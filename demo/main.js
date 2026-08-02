import VisualController from '/src/main.js'
import Hello   from './hello.js'
import Sidebar from './sidebar.js'


const Apps = { Hello, Sidebar }
const choice = { header: 'Hello', sidebar: 'Sidebar' }


const vc = new VisualController({})

vc.set(({ start, end }) => {
    document.querySelector('#region-header').append(start, end)
    return 'header'
})

vc.set(({ start, end }) => {
    document.querySelector('#region-sidebar').append(start, end)
    return 'sidebar'
})


const $ = id => document.getElementById(id)

function refreshStatus () {
    $('listText').textContent       = JSON.stringify(vc.list())
    $('hasHeader').textContent      = vc.has('header')
    $('hasSidebar').textContent     = vc.has('sidebar')
    $('emptyHeader').textContent    = vc.isEmpty('header')
    $('emptySidebar').textContent   = vc.isEmpty('sidebar')
}


async function publishTo (alias, componentName, data = {}) {
    await vc.publish(alias, Apps[componentName], data)
    refreshStatus()
}


publishTo('header',  'Hello',   { message: 'Header app'  })
publishTo('sidebar', 'Sidebar', { message: 'Sidebar app' })


$('updateHeader').addEventListener('click', () => {
    const app = vc.getApp('header')
    if (app)   app.changeMessage(`Updated at ${new Date().toLocaleTimeString()}`)
})


$('incrementHeader').addEventListener('click', () => {
    const app = vc.getApp('header')
    if (app)   app.increment()
})


$('updateSidebar').addEventListener('click', () => {
    const app = vc.getApp('sidebar')
    if (app)   app.changeMessage(`Updated at ${new Date().toLocaleTimeString()}`)
})


$('swap').addEventListener('click', () => {
    const tmp = choice.header
    choice.header  = choice.sidebar
    choice.sidebar = tmp
    publishTo('header',  choice.header)
    publishTo('sidebar', choice.sidebar)
})


$('destroyHeader').addEventListener('click', () => {
    vc.destroy('header')
    refreshStatus()
})


$('destroySidebar').addEventListener('click', () => {
    vc.destroy('sidebar')
    refreshStatus()
})


$('resetAll').addEventListener('click', () => {
    vc.reset()
    refreshStatus()
})
