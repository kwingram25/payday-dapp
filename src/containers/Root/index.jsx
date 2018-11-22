import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import App from 'containers/App'
import DeleteBillDialog from 'components/DeleteBillDialog'
import DeleteContactDialog from 'components/DeleteContactDialog'
import PaymentDialog from 'components/PaymentDialog'
import QRCodeDialog from 'components/QRCodeDialog'

import { muiThemeOptions as options } from 'config/app'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.theme = createMuiTheme(options)
    this.previousLocation = this.isModalRoute(props.location)
      ? { pathname: '/' }
      : props.location
  }
  // 
  // componentWillMount() {
  //   const { actions } = this.props
  //   actions.userAccountFetch()
  //   actions.contactsFetch()
  // }

  componentWillUpdate() {
    const { location } = this.props
    if (
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = location
    }
  }

  isModalRoute = (location = this.props.location) => {
    switch (location) {
      case '/bill/delete':
      case '/bill/pay':
      case '/contact/delete':
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

  render() {
    const { location } = this.props

    const isModal = this.hasModalState(location) || this.isModalRoute(location)

    return (
      <MuiThemeProvider theme={this.theme}>
        <div>
          <Switch location={isModal ? (this.previousLocation || { pathname: '/' }) : location}>
            <Route path="/" component={App} />
          </Switch>
          <Route path="/bill/delete" component={DeleteBillDialog} />
          <Route path="/bill/pay" component={PaymentDialog} />
          <Route path="/contact/delete" component={DeleteContactDialog} />
          <Route path="/qr" component={QRCodeDialog} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default () => (
  <Route component={Root} />
)
