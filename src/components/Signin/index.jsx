import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  isSignInPending,
  isUserSignedIn,
} from 'blockstack'

import Fade from '@material-ui/core/Fade'

import { userSignIn } from 'actions/auth'

import Loader from 'components/Loader'

import {
  SignInWrapper,
  SignInTitle,
  SignInText,
  SignInButton,
} from './views'

export default
@connect(
  null,
  dispatch => ({
    actions: bindActionCreators({
      userSignIn,
    }, dispatch),
  }),
)
class Signin extends React.Component {
  state = {
    fadeIn: true,
  }

  componentWillUnmount() {
    this.setState({ fadeIn: false })
  }

  render() {
    const { actions } = this.props
    const { fadeIn } = this.state
    // if (isUserSignedIn()) {
    //   return (
    //     <Redirect to="/dashboard" />
    //   )
    // }
    if (isSignInPending()) {
      return (
        <Fade in={fadeIn}>
          <Loader size={72} />
        </Fade>
      )
    }

    return (
      <Fade in={fadeIn}>
        <SignInWrapper elevation={12}>
          <SignInTitle variant="display1">
          Welcome!
          </SignInTitle>
          <SignInText>
          PayDay is a Dapp allowing you to securely bill others and make payments with Ethereum
          </SignInText>
          <SignInButton
            variant="contained"
            color="primary"
            id="signin-button"
            onClick={() => {
              actions.userSignIn()
            }}
          >
          Sign In with Blockstack
          </SignInButton>
        </SignInWrapper>
      </Fade>
    )
  }
}
