import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware()]
const composeFunc =
  process.env.NODE_ENV === 'development' ? composeWithDevTools : compose
const composedEnhancers = composeFunc(
  applyMiddleware(...middleware),
  ...enhancers
)
const store = createStore(rootReducer(), initialState, composedEnhancers)

export default store
