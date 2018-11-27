import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isUserSignedIn } from 'blockstack'

import withStyles from '@material-ui/core/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import { userSignIn } from 'actions/auth'
import { dashboard } from 'actions/navigation'

import Loader from 'components/Loader'

import styles from './styles'

export default
@connect(
  ({ auth }) => ({
    isSigningIn: auth.working === 'post-signin',
  }),
  dispatch => ({
    actions: bindActionCreators({
      userSignIn,
      dashboard,
    }, dispatch),
  }),
)
@withStyles(styles)
class Signin extends React.Component {
  state = {
    fadeIn: true,
  }

  componentWillMount() {
    const { actions } = this.props
    if (isUserSignedIn()) {
      actions.dashboard()
    }
  }

  componentWillUnmount() {
    this.setState({ fadeIn: false })
  }

  render() {
    const { actions, isSigningIn, classes } = this.props
    const { fadeIn } = this.state

    if (isSigningIn) {
      return (
        <Fade in={fadeIn}>
          <Loader size={72} />
        </Fade>
      )
    }

    return (
      <Fade in={fadeIn}>
        <div>
          <Paper className={classes.root} elevation={12}>
            <div className={classes.title}>
          Welcome!
            </div>
            <div className={classes.copy}>
          PayDay is a Dapp allowing you to securely bill others and make payments with Ethereum
            </div>
            <Button
              size="large"
              className={classes.button}
              variant="contained"
              color="primary"
              id="signin-button"
              onClick={() => {
                actions.userSignIn()
              }}
            >
          Sign In with Blockstack
            </Button>
          </Paper>
        </div>
      </Fade>
    )
  }
}
