import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/index'
import './index.css'
import Root from './config/root'

const target = document.getElementById('root')

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    target
  )
}

render(Root)

// const target = document.getElementById('root')

// const render = () => {
//   ReactDOM.render(
//     <Provider store={store}>
//       <App />
//     </Provider>,
//     target
//   )
// }

// render()
