import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

import EthTextField from 'components/EthTextField'

export default
@connect(
  ({ router }) => ({
    open: /\/bill\/pay/.test(router.location.pathname),
  }),
  dispatch => ({
    actions: bindActionCreators({
      goBack,
    }, dispatch),
  }),
)
class PaymentDialog extends React.Component {
  state = {
    amount: 0,
    gasPrice: 3,
    gasLimit: 21000,
    error: null,
  }

  formFieldProps = () => {
    const { error } = this.state
    return (key, id, label, value) => {
      let variant = 'eth'

      switch (id) {
        case 'gas-limit':
          variant = 'limit'
          break
        case 'gas-price':
          variant = 'gwei'
          break
        default:
          break
      }

      return {
        variant,
        label,
        value,
        dense: true,
        fullWidth: true,
        error: error === id,
        helperText: error === id && 'Invalid amount',
        onChange: (amt, isValid) => {
          this.setState({
            error: !isValid && 'amount',
            [key]: amt,
          })
        },
      }
    }
  }

  render() {
    const {
      open,
      actions,
    } = this.props
    const {
      amount,
      gasPrice,
      gasLimit,
      error,
    } = this.state

    const dialogProps = {
      open,
      onClose: actions.goBack,
      maxWidth: 'xs',
      'aria-labelled-by': 'form-dialog-title',
    }

    const dialogTitleProps = {
      id: 'form-dialog-title',
    }

    return (
      <Dialog {...dialogProps}>
        <DialogTitle {...dialogTitleProps}>
          Pay Bill
        </DialogTitle>
        <DialogContent>
          <EthTextField {...this.formFieldProps()('amount', 'amount', 'Amount', amount)} />
          <EthTextField {...this.formFieldProps()('gasPrice', 'gas-price', 'Gas Price', gasPrice)} />
          <EthTextField {...this.formFieldProps()('gasLimit', 'gas-limit', 'Gas Limit', gasLimit)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={actions.goBack} color="primary">
              Cancel
          </Button>
          <Button onClick={actions.goBack} color="primary">
              Pay
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
