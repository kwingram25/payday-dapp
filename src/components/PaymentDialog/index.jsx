import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'
import gett from 'lodash.get'

import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import SendIcon from '@material-ui/icons/Send'
import CloseIcon from '@material-ui/icons/Close'

import EthTextField from 'components/EthTextField'
import Loader from 'components/Loader'
import BillInfo from 'components/BillInfo'
import RouteDialog from 'components/RouteDialog'

import { iconButtonStyles } from 'components/styles'

import { getTxErrors } from 'models/Payment'

import {
  dashboard,
} from 'actions/navigation'
import {
  paymentsCreate,
} from 'actions/payments'

export default
@connect(
  ({
    router, auth, bills, contacts, payments,
  }) => {
    const billId = router.location.hash.replace(/#/g, '')
    const bill = gett(bills, ['data', billId], null)

    const isReady = !!auth.user
      && !!contacts.data
      && !!payments.data

    if (!isReady) {
      return { isReady }
    }

    const isValid = !!bill && !bill.isClosed

    if (!isValid) {
      return { isReady, isValid }
    }

    const contact = gett(contacts, ['data', bill.owner])

    return {
      isReady,
      isValid,
      isSending: payments.creating,
      balance: auth.user.balance,
      bill: bill.toObject(true),
      contact,
      user: auth.user,
    }
  },
  dispatch => ({
    actions: bindActionCreators({
      goBack,
      dashboard,
      paymentsCreate,
    }, dispatch),
  }),
)
@withStyles(iconButtonStyles)
class PaymentDialog extends React.Component {
  state = {
    amount: 0,
    gasPrice: 3,
    gasLimit: 21000,
    confirmed: false,
    error: {},
  }

  constructor(props) {
    super(props)

    const prefill = props.bill ? {
      amount: props.bill.amountRemaining,
    } : {}

    this.state = {
      ...this.state,
      ...prefill,
      error: {
        ...this.state.error,
        ...getTxErrors(prefill, props.user),
        ...props.error,
      },
    }
  }

  componentWillMount() {
    const { actions, isReady, isValid } = this.props
    if (isReady && !isValid) {
      actions.dashboard()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { actions } = this.props
    if (!nextProps.isValid && nextProps.isReady) {
      actions.dashboard()
      return
    }

    if (!this.props.bill && nextProps.bill) {
      const newAttrs = {
        amount: nextProps.bill.amountRemaining,
      }

      this.setState(state => ({
        amount: nextProps.bill.amountRemaining,
        error: {
          ...state.error,
          ...getTxErrors(newAttrs, nextProps.user),
          ...nextProps.error,
        },
      }))
    }
  }

  pay = () => {
    const {
      amount,
      gasPrice,
      gasLimit,
    } = this.state
    const {
      actions,
      user: {
        username: sender,
      },
      bill: {
        id: billId,
      },
      contact: {
        username: recipient,
      },
    } = this.props

    actions.paymentsCreate({
      billId,
      sender,
      recipient,
      amount,
      gasPrice,
      gasLimit,
    })
  }

  getErrors = (obj = this.state) => ['amount', 'gasPrice', 'gasLimit'].reduce(
    (errors, key) => ({
      ...errors,
      ...this.getError(key, obj[key]),
    }),
    {},
  )

  getError = (key, value) => {
    const { balance } = this.props
    switch (key) {
      case 'amount':
        if (value > balance) {
          return {
            amount: 'insufficient-funds',
          }
        }
        if (value <= 0) {
          return {
            amount: 'invalid',
          }
        }
        return {}
      default:
        if (value <= 0) {
          return {
            [key]: 'invalid',
          }
        }
        return {}
    }
  }

  setKeyWithErrors = (key, value) => {
    const { user } = this.props
    const { error } = this.state
    this.setState({
      [key]: value,
      error: {
        ...error,
        [key]: getTxErrors({ [key]: value }, user)[key],
      },
    })
  }


  errorText = (key, code) => {
    if (!code) {
      return null
    }
    switch (key) {
      case 'amount':
        switch (code) {
          case 'insufficient-funds':
            return 'Insufficient funds'
          case 'invalid-amount':
          default:
            return 'Invalid amount'
        }
      case 'gasPrice':
        return 'Invalid gas price'
      case 'gasLimit':
        return 'Invalid gas limit'
      default:
        return null
    }
  }

  formFieldProps = () => {
    const { bill } = this.props
    return (key, id, label, value) => {
      const {
        error: {
          [key]: error,
        },
      } = this.state

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
        fullWidth: true,
        error: !!error,
        helperText: this.errorText(key, error),
        style: {
          marginBottom: '22px',
        },
        ...(
          id === 'amount' && bill
            ? { max: bill.amountRemaining }
            : {}
        ),

        onChange: (val) => {
          this.setKeyWithErrors(key, val)
        },
      }
    }
  }

  dialogContent = () => {
    const {
      isReady,
      isValid,
      bill,
      contact,
    } = this.props

    const {
      amount,
      gasPrice,
      gasLimit,
      confirmed,
    } = this.state

    if (!isReady || !isValid) {
      return (
        <Loader size={40} />
      )
    }

    return (
      <div>
        <BillInfo bill={bill} contact={contact} />
        <EthTextField {...this.formFieldProps()('amount', 'amount', 'Amount', amount)} />
        <EthTextField {...this.formFieldProps()('gasPrice', 'gas-price', 'Gas Price', gasPrice)} />
        <EthTextField {...this.formFieldProps()('gasLimit', 'gas-limit', 'Gas Limit', gasLimit)} />
        <FormGroup row>
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                checked={confirmed}
                onChange={(e) => {
                  this.setState({ confirmed: e.target.checked })
                }}
              />
          )}
            label="Confirm your payment?"
          />
        </FormGroup>
      </div>
    )
  }

  render() {
    const {
      isSending,
      classes,
    } = this.props
    const {
      error,
      confirmed,
    } = this.state
    const dialogProps = {
      maxWidth: 'sm',
      'aria-labelled-by': 'form-dialog-title',
    }

    const dialogTitleProps = {
      id: 'form-dialog-title',
    }

    return (
      <RouteDialog {...{
        id: 'pay-bill',
        routeRegex: /\/bill\/pay/,
        maxWidth: 'xs',
        dialogTitle: 'Pay Bill',
        dialogProps,
        dialogTitleProps,
        dialogContent: this.dialogContent(),
        dialogActions: exit => (isSending ? [] : [
          <Button
            key="cancel-button"
            onClick={exit}
            variant="outlined"
            color="default"
          >
            <CloseIcon className={classes.buttonIcon} />
            Cancel
          </Button>,
          <Button
            key="pay-button"
            disabled={!confirmed || Object.keys(error).length > 1}
            onClick={() => {
              this.pay()
              exit()
            }}
            variant="contained"
            color="primary"
          >
            <SendIcon className={classes.buttonIcon} />
            Pay
          </Button>,
        ]),

      }}
      />
    )
  }
}
