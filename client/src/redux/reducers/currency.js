import { GETCURRENCYRATELIST, GETCURRENCYPRICE } from '../types'

const initialState = {
  currency: 'USD',
  usdRate: 0,
  currencyRate: 1,
  currencyExchange: 1,
  rateList: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GETCURRENCYRATELIST: {
      return {
        ...state,
        usdRate: action.usdRate,
        currencyRate: action.usdRate,
        rateList: action.rateList,
      }
    }
    case GETCURRENCYPRICE: {
      return {
        ...state,
        currency: action.currency,
        usdRate: action.usdRate,
        currencyRate: action.currencyRate,
        currencyExchange: action.currencyRate / action.usdRate,
      }
    }
    default:
      return state
  }
}
