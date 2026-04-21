import VisualController from '/src/main.js'
import Hello from '/demo/hello.js'

const 
  vc = new VisualController({})
  , hasTextBlock = document.getElementById ( 'hasText' )
  , updateMsgBtn = document.getElementById ( 'updateMsg' )
  , incrementBtn = document.getElementById ( 'increment' )
  , getCountBtn = document.getElementById ( 'getCount' )
  , destroyBtn = document.getElementById ( 'destroy' )
  , resultTextBlock = document.getElementById ( 'resultText' )
  ;



vc.publish ( Hello, { message: 'Hi from Lit!' }, 'app')
    .then ( updates => {
            console.log ( 'App loaded with updates:', updates )
            hasTextBlock.textContent = vc.has('app')
        })



 updateMsgBtn.addEventListener ( 'click', () => {
            const app = vc.getApp ( 'app' )
            if (app)   app.changeMessage ( `Updated at ${new Date().toLocaleTimeString()}` )
      })



 incrementBtn.addEventListener ( 'click', () => {
            const app = vc.getApp('app')
            if (app) app.increment()
      })



getCountBtn.addEventListener ( 'click', () => {
            const app = vc.getApp ( 'app' )
            if ( app ) {
                resultTextBlock.textContent = app.getCount ()
              }
      })



destroyBtn.addEventListener ( 'click', () => {
            const result = vc.destroy ( 'app' )
            resultTextBlock.textContent = 'Destroyed: ' + result
            hasTextBlock.textContent = vc.has ( 'app' )
      })