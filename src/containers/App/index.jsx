import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Route, Redirect, Switch, withRouter,
} from 'react-router-dom'

import withStyles from '@material-ui/core/styles/withStyles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'

import {
  isSignInPending,
  isUserSignedIn,
} from 'blockstack'

import { userPostSignIn } from 'actions/auth'

import Signin from 'pages/Signin'
import Dashboard from 'pages/Dashboard'
import Bill from 'pages/Bill'

import Header from 'components/Header'
import Sidebar from 'components/Sidebar'

import styles from './styles'

const ProtectedRoute = props => (isUserSignedIn()
  ? <Route {...props} />
  : <Redirect exact to="/" />)

const FallbackRoute = ({ authenticated }) => (
  <Redirect to={authenticated ? '/dashboard' : '/'} />
)

const renderBill = (props) => {
  const { location, match } = props
  const id = location.hash.replace(/#/g, '')
  const isNew = match.params[0] === 'new'
  const isEditing = isNew || match.params[0] === 'edit'
  const target = location.state && location.state.target

  return (
    <Bill
      {...(isNew ? { isNew } : { id })}
      {...{ isEditing, target }}
    />
  )
}


class App extends React.Component {
  componentWillMount() {
    const { actions } = this.props

    if (isSignInPending() || isUserSignedIn()) {
      actions.userPostSignIn()
    }
  }

  render() {
    const { authenticated, classes } = this.props
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Header />
          </Grid>
          {authenticated && (
            <Grid item sm={12} md={4}>
              <Sidebar />
            </Grid>
          )}

          <Grid
            className={classes.mainPanel}
            item
            xs={12}
            {...(authenticated
              ? {
                sm: 12,
                md: 8,
              } : {
                xs: 12,
              })}
          >
            <Switch>
              <Route
                exact
                path="/"
                component={Signin}
              />
              <ProtectedRoute
                authenticated={authenticated}
                path="/dashboard"
                component={Dashboard}
              />
              <ProtectedRoute
                authenticated={authenticated}
                path="/bill/(edit|new)?"
                render={renderBill}
              />
              <FallbackRoute />
            </Switch>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default
withRouter(
  connect(
    ({ auth }) => ({
      authenticated: auth.authenticated,
    }),
    dispatch => ({
      actions: bindActionCreators({
        userPostSignIn,
      }, dispatch),
    }),
  )(
    withStyles(styles)(App),
  ),
)
