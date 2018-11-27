import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

import moment from 'moment'

import App from 'containers/App'
import DeleteBillDialog from 'components/DeleteBillDialog'
import DeleteContactDialog from 'components/DeleteContactDialog'
import PaymentDialog from 'components/PaymentDialog'
import QRCodeDialog from 'components/QRCodeDialog'
import Notification from 'components/Notification'
import TxStatus from 'components/TxStatus'
import TestMode from 'components/TestMode'

import HelmetConfig from 'config/helmet'
import { muiThemeOptions as options } from 'config/styles'

moment.locale('en-US')

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.theme = createMuiTheme(options)
    this.previousLocation = this.isModalRoute(props.location)
      ? { pathname: '/dashboard' }
      : props.location
  }

  componentWillUpdate() {
    const { location } = this.props
    if (!location.state || !location.state.modal) {
      this.previousLocation = location
    }
  }

  isModalRoute = (location = this.props.location) => {
    switch (location.pathname) {
      case '/bill/delete':
      case '/bill/pay':
      case '/contact/delete':
      case '/qr':
        return true
      default:
        return false
    }
  }

  hasModalState = ({ state }) => {
    if (state) {
      return state.modal
    }
    return false
  }

  pageTitle = () => {
    const { location } = this.props

    switch (location.pathname) {
      case '/':
        return 'Sign In'
      case '/dashboard':
        return 'Dashboard'
      case '/bill':
        return 'View Bill'
      case '/bill/edit':
        return 'Edit Bill'
      case '/bill/delete':
        return 'Delete Bill'
      case '/bill/pay':
        return 'Pay Bill'
      case '/qr':
        return 'QR Code'
      case '/contact/delete':
        return 'Delete Contact'
      default:
        return null
    }
  }

  render() {
    const { location } = this.props

    const isModal = this.hasModalState(location) || this.isModalRoute(location)

    return (
      <MuiThemeProvider theme={this.theme}>
        <div>
          <HelmetConfig />
          <Helmet title={this.pageTitle()} />
          <Switch location={isModal ? this.previousLocation : location}>
            <Route path="/" component={App} />
          </Switch>
          <Route path="/bill/delete" component={DeleteBillDialog} />
          <Route path="/bill/pay" component={PaymentDialog} />
          <Route path="/contact/delete" component={DeleteContactDialog} />
          <Route path="/qr" component={QRCodeDialog} />
          <Notification />
          <TxStatus />
          <TestMode />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default () => (
  <Route component={Root} />
)
