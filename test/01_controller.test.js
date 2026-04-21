import { describe, it, expect, beforeEach } from 'vitest'
import VisualController from "../src/main.js";
import Test from '../components/Test.js'
import Layout from '../components/Layout.js'
import NoUpdates from '../components/NoUpdates.js'
import fs from 'fs'
import path from 'path'

beforeEach(() => {
  const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'index.html'), 'utf-8')
  document.body.innerHTML = html
})

describe ( 'Visual controller for lit', () => {

    it ( 'Method "publish" returns a promise', async () => {
        const r = { value: 0 }
        const root = document.querySelector('#root')
        const vc = new VisualController({ r })
        root.id = 'el'

        const el = await vc.publish(Test, {}, 'el')
        
        expect(el).toBeDefined()
    })


    it ( 'Method "has"', async () => {
        const r = { value: 0 }
        const vc = new VisualController({ r })
        
        const before = vc.has('a')
        
        await vc.publish(Test, {}, 'a')
        
        const after = vc.has('a')
        
        expect(before).toBe(false)
        expect(after).toBe(true)
    })


    it ( 'No update methods', async () => {
        const r = { value: 0 }
        const root = document.querySelector('#root')
        const vc = new VisualController({ r })
        root.id = 'el'

        await vc.publish(NoUpdates, {}, 'el')
        
        const x = vc.getApp('el')
        
        expect(Object.keys(x).length).toBe(0)
        vc.destroy('el')
    })

})