import React from 'react'

import {
  Route, Redirect, Switch, withRouter,
} from 'react-router-dom'
import {
  isUserSignedIn,
} from 'blockstack'


import Dashboard from 'components/Dashboard'
import Signin from 'components/Signin'
import Bill from 'components/Bill'


import { SiteWrapper } from './views'

const ProtectedRoute = props => (isUserSignedIn()
  ? <Route {...props} />
  : <Redirect exact to="/" />)

// const ProtectedRoute = ({ Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props => (isUserSignedIn() ? (
//       <Component {...props} />
//     ) : (
//       <Redirect exact to={{ pathname: '/', exact: true, state: { from: props.location } }} />
//     ))
//         }
//   />
// )

export default () => (
  <Switch>
    <Route exact path="/" component={Signin} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <ProtectedRoute path="/bill/new" component={Bill} />
    <Route path="/:any" component={Signin} />
  </Switch>
)

/*

<div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
  {isUserSignedIn() && <Header />}
  {isUserSignedIn() && <RoutingPanel />}
  <Switch>
    <Route exact path="/" component={Home} />
    <ProtectedRoute exact {...props} path="/wallets" Component={WalletList} />
    <ProtectedRoute {...props} path="/wallet/:id" Component={Wallet} />
    <ProtectedRoute {...props} path="/exchange" Component={Exchange} />
    <Route path="/:any" component={Initial} />
  </Switch>
</div> */
