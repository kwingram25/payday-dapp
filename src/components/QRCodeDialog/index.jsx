import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import QRCode from 'qrcode'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import Loader from 'components/Loader'
import RouteDialog from 'components/RouteDialog'

export default
@connect(
  ({ auth, router }) => ({
    isReady: !!auth.user && !!auth.user.address,
    address: auth.user && auth.user.address,
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
    const { isReady } = this.props
    const { qrCode } = this.state
    if (isReady && !qrCode) {
      this.getQRCode()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { qrCode } = this.state
    if (nextProps.isReady && !qrCode) {
      this.getQRCode(nextProps.address)
    }
  }

  getQRCode = async (address = this.props.address) => {
    const qrCode = await QRCode.toDataURL(address, { width: 300 })

    this.setState({
      qrCode,
    })
  }

  dialogContent = () => {
    const {
      isReady,
    } = this.props

    if (!isReady) {
      return (
        <Loader size={40} />
      )
    }

    const {
      qrCode,
    } = this.state

    const qrCodeProps = {
      src: qrCode,
    }

    return (
      <Paper elevation={12}>
        <img alt="QR Code" {...qrCodeProps} />
      </Paper>
    )
  }

  render() {
    const closeButtonProps = exit => ({
      color: 'default',
      onClick: exit,
    })

    return (
      <RouteDialog {...{
        id: 'qr-code',
        routeRegex: /\/qr/,
        maxWidth: 'xs',
        dialogContent: this.dialogContent(),
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
