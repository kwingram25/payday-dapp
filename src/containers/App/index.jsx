import React, { Link } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Route, Redirect, Switch, withRouter,
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import {
  push,
} from 'connected-react-router'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'

import {
  isSignInPending,
  isUserSignedIn,
  handlePendingSignIn,
} from 'blockstack'


import { createUserObject } from 'utils'

import {
  userSignInSuccess,
  userSignInError,
} from 'actions/auth'

import Dashboard from 'components/Dashboard'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import Signin from 'components/Signin'
import Bill from 'components/Bill'

import { SiteWrapper, MainPanel } from './views'

const ProtectedRoute = props => (isUserSignedIn()
  ? <Route {...props} />
  : <Redirect exact to="/" />)

const FallbackRoute = props => (
  <Redirect to={isUserSignedIn() ? '/dashboard' : '/'} />
)

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

const Layout = ({ children }) => ((
  <SiteWrapper>
    <CssBaseline />
    <Grid container spacing={24}>
      {isUserSignedIn() && (
        <Route>
          <React.Fragment>
            <Grid item xs={12}>
              <Header />
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <Sidebar />
            </Grid>
          </React.Fragment>
        </Route>
      )}
      <Grid
        item
        xs={12}
        {...isUserSignedIn()
          ? {
            sm: 7,
            md: 8,
          } : {
            xs: 12,
          }}
      >
        {children}
      </Grid>
    </Grid>
  </SiteWrapper>
))

const MySwitch = withRouter(() => ((
  <div>
    <Switch>
      <Route exact path="/" component={Signin} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/bill" component={Bill} />
      <ProtectedRoute path="/bill/:id" component={Bill} />
    </Switch>
  </div>
)))

class App extends React.PureComponent {
  // state = {
  //   fadeIn: true,
  // }

  componentWillMount() {
    const { actions, user, isIndex } = this.props
    if (isSignInPending()) {
      handlePendingSignIn()
        .then(() => {
          actions.userSignInSuccess(
            createUserObject(),
          )
          actions.goToDashboard()
        })
        .catch((error) => {
          actions.userSignInError(error)
        })
    } else if (isUserSignedIn()) {
      actions.userSignInSuccess(
        createUserObject(),
      )
      if (isIndex) {
        actions.goToDashboard()
      }
    }
  }

  render() {
    console.log('App', Date.now())
    return (
      <SiteWrapper>
        <CssBaseline />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Header />
          </Grid>
          {isUserSignedIn() && (
            <Grid item sm={12} md={4}>
              <Sidebar />
            </Grid>
          )}

          <MainPanel
            item
            xs={12}
            {...(isUserSignedIn()
              ? {
                sm: 12,
                md: 8,
              } : {
                xs: 12,
              })}
          >
            <Switch>
              <Route exact path="/" component={Signin} />
              <ProtectedRoute path="/dashboard" component={Dashboard} />
              <ProtectedRoute exact path="/bill" component={Bill} />
              <ProtectedRoute exact path="/bill/(edit|new)?" component={Bill} />
              <FallbackRoute />
            </Switch>

          </MainPanel>

        </Grid>

      </SiteWrapper>
    )
  }
}

export default connect(
  ({ auth, router }) => ({
    user: auth.user,
    isIndex: router.location.pathname === '/',
    // pathname: router.location.pathname,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators({
        userSignInSuccess,
        userSignInError,
      }, dispatch),
      goToDashboard: () => dispatch(push('/dashboard')),
    },
  }),
)(App)

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
