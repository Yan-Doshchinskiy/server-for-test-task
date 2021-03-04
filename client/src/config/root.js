import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from '../components/Header/Header'
import Footer from '../components/Footer'

const Root = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Header} />
      <Route exact path="/footer" component={Footer} />
    </Switch>
  </BrowserRouter>
)

export default Root
