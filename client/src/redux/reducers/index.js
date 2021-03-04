import { combineReducers } from 'redux'
import currency from './currency'



const createRootReducer = () =>
  combineReducers({
    currency
    // сюда вставляем редьюсеры
  })

export default createRootReducer
