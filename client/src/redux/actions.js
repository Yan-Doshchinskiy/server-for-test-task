import axios from 'axios'
import {
  GETCURRENCYRATELIST,
  GETCURRENCYPRICE
} from './types'


// currency actions

export function getCurrencyRateList() {
  return (dispatch) => {
    axios
      .get('https://www.cbr-xml-daily.ru/daily_json.js')
      .then((result) => result.data)
      .then(({ Valute }) => {
        dispatch({
          type: GETCURRENCYRATELIST,
          usdRate: Valute.USD.Value,
          rateList: Valute,
        })
      })
  }
}

export function getCurrencyPrice(props) {
  return (dispatch, getState) => {
    const nextCurrency = props
    const store = getState()
    const { rateList } = store.currency
    const currencyIndex = Object.keys(rateList).findIndex(
      (it) => it === nextCurrency
    )
    const currencyValue = Object.values(rateList)[currencyIndex].Value
    dispatch({
      type: GETCURRENCYPRICE,
      currency: nextCurrency,
      usdRate: rateList.USD.Value,
      currencyRate: currencyValue,
    })
  }
}



export default 'someObject'
