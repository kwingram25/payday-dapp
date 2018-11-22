import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import QRCode from 'qrcode'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import Loader from 'components/Loader'
import RouteDialog from 'components/RouteDialog'

export default
@connect(
  ({ account, router }) => ({
    address: account.address,
    open: /\/qr/.test(router.location.pathname),
  }),
  dispatch => ({
    actions: bindActionCreators({
      goBack,
    }, dispatch),
  }),
)
class AddressQRCodeDialog extends Component {
  state = {
    qrCode: null,
  }

  componentWillMount() {
    this.getQRCode()
  }

  getQRCode = async () => {
    console.log('fuckkkk')
    const { address } = this.props

    const qrCode = await QRCode.toDataURL(address, { width: 300 })

    this.setState({
      qrCode,
    })
  }

  render() {
    // console.log('AddressQRCodeDialog');


    const {
      open,
      actions,
    } = this.props

    const {
      qrCode,
    } = this.state

    const dialogProps = {
      open: open || false,
      onClose: () => {
        actions.goBack()
      },
    }

    const qrCodeProps = {
      src: qrCode,
    }

    const closeButtonProps = exit => ({
      color: 'default',
      onClick: exit,
    })

    return (
      <RouteDialog {...{
        routeRegex: /\/qr/,
        maxWidth: 'xs',
        dialogContent: qrCode ? (
          <Paper elevation={12}>
            <img alt="QR Code" {...qrCodeProps} />
          </Paper>
        ) : (
          <Loader size={40} />
        ),
        dialogActions: exit => (
          <Button {...closeButtonProps(exit)}>
            Close
          </Button>
        ),
      }}
      />
    )
  }
}
