import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { goBack } from 'connected-react-router'
import moment from 'moment'
import gett from 'lodash.get'
import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import WarningIcon from '@material-ui/icons/Warning'

import {
  billsCreate,
  billsUpdate,
  billsDelete,
  billsMarkAsPaid,
} from 'actions/bills'
import {
  dashboard,
} from 'actions/navigation'

import { getErrors } from 'models/Bill'

import EthBalance from 'components/EthBalance'
import EthTextField from 'components/EthTextField'
import UserAvatar from 'components/UserAvatar'
import UserContacts from 'components/UserContacts'
import Loader from 'components/Loader'
import SmallHeader from 'components/SmallHeader'

import Payments from './Payments'
import Footer from './Footer'

import styles from './styles'

export default
@connect(
  (
    {
      auth, bills, contacts, payments,
    },
    { id, isNew, target: prefillTarget },
  ) => {
    const isReady = auth.user
      && (isNew || gett(bills, ['data', id]))
      && contacts.data
      && payments.data

    if (!isReady) {
      return {
        isReady,
      }
    }

    const me = gett(auth, ['user', 'username'])
    let bill
    let refContact
    if (isNew) {
      bill = {
        isOwned: true,
        owner: me,
        target: prefillTarget,
      }
    } else if (bills.data && bills.data[id]) {
      const { isOwned, owner, target } = bills.data[id]
      refContact = gett(contacts, ['data', isOwned ? target : owner], null)
      bill = {
        ...bills.data[id].toObject(true),
        ...(isOwned ? {
          owner: me,
          target: refContact && refContact.username,
        } : {
          owner: refContact && refContact.username,
          target: me,
        }),
      }
    }

    return {
      bill,
      contacts: contacts.data,
      error: bills.error,
      isReady,
      isValid: !isReady || (bill && (isNew || refContact)),
      isCreating: bills.creating,
      isUpdating: bills.updating,
      isDeleting: bills.deleting,
      isSending: payments.creating,
    }
  },
  dispatch => ({
    actions: {
      ...bindActionCreators({
        billsCreate,
        billsUpdate,
        billsDelete,
        billsMarkAsPaid,
        goBack,
        dashboard,
      }, dispatch),
    },
  }),
)
@withStyles(styles)
class Bill extends React.Component {
  billState = {
    id: null,
    owner: null,
    target: null,
    amount: '',
    description: '',
    date: moment().unix(),
  }

  state = {
    ...this.billState,
    showContactSelect: false,
    fadeIn: true,
    error: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      ...(
        props.bill
          ? props.bill
          : {}
      ),
      ...(
        props.error
          ? props.error
          : {}
      ),
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      bill, actions,
    } = this.props

    if (nextProps.isReady && !nextProps.isValid) {
      actions.dashboard()
      return
    }

    // Clear state for new bill
    if (nextProps.isNew) {
      this.setState({
        ...this.billState,
        ...nextProps.bill,
      })
      return
    }

    const changedBill = bill !== nextProps.bill
    const changedEditing = nextProps.isEditing !== this.props.isEditing
    const changedReady = nextProps.isReady && !this.props.isReady

    console.log(changedBill, changedEditing, changedReady)

    if (changedEditing || changedReady || changedBill) {
      this.setState(state => ({
        ...this.billState,
        ...state,
        ...nextProps.bill,
        error: {
          ...state.error,
          ...nextProps.error,
        },
      }))
    }
  }

  shouldComponentUpdate(nextProps) {
    const { isValid } = this.props
    if (isValid && !nextProps.isValid) {
      return false
    }
    return true
  }

  componentWillUnmount() {
    this.setState({ fadeIn: false })
  }

  setKeyWithErrors = (key, value) => {
    const { error } = this.state
    this.setState({
      [key]: value,
      error: {
        ...error,
        [key]: getErrors({ [key]: value })[key],
      },
    })
  }

  errorText = (field) => {
    const { error } = this.state
    const code = error[field]
    switch (code) {
      case 'invalid': {
        switch (field) {
          case 'amount':
            return 'Invalid amount'
          case 'description':
            return 'Invalid description'
          case 'date':
            return 'Invalid date'
          case 'target':
            return 'You must select a bill recipient'
          default:
            return null
        }
      }
      default:
        return 'Unknown error'
    }
  }

  createOrUpdate = () => {
    const {
      actions,
      isNew,
    } = this.props

    const {
      id,
      owner,
      target,
      amount,
      date,
      description,
    } = this.state

    if (target === owner) {
      return
    }

    const data = {
      owner,
      target,
      amount,
      description,
      date: date || moment().unix(),
    }

    if (isNew) {
      actions.billsCreate(data)
    } else {
      actions.billsUpdate(
        id,
        data,
      )
    }
  }

  titleBar = () => {
    const {
      isEditing,
      isNew,
      classes,
    } = this.props

    return (
      <AppBar color="default" position="absolute">
        <Toolbar>
          <div className={classes.title}>
            {(() => {
              if (isEditing) {
                return (isNew ? 'New Bill' : 'Edit Bill')
              }
              return 'View Bill'
            })()}
          </div>
          <IconButton
            component={Link}
            to="/dashboard"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }

  user = () => {
    const {
      contacts,
      isNew,
      isEditing,
      classes,
    } = this.props
    const {
      isOwned,
      owner,
      target,
      amountPaid,
      error,
    } = this.state

    const refContact = contacts[isOwned ? target : owner]

    return (
      <div className={classes.user}>
        <UserAvatar big {...(refContact || {})} />
        <div className={classes.name}>
          {refContact && refContact.name}
        </div>
        <div className={classes.username}>
          {refContact && refContact.username}
        </div>
        {(isNew || (isEditing && amountPaid === 0)) && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.setState({ showContactSelect: true })
          }}
        >
          {target ? 'Change' : 'Select'}
        </Button>
        )}
        {(isEditing && error.target) && (
        <div className={classes.errorText}>
          {this.errorText('target')}
        </div>
        )}
      </div>
    )
  }

  amount = () => {
    const {
      isEditing,
      classes,
    } = this.props
    const {
      isOwned,
      isPaid,
      isClosed,
      amount,
      amountPaid,
      amountRemaining,
      error,
    } = this.state

    return (
      <div className={classes.attribute}>
        <SmallHeader>
          {(() => {
            if (isOwned) {
              return isClosed ? 'Paid You' : 'Owes You'
            }
            return isClosed ? 'You Paid' : 'You Owe'
          })()}
        </SmallHeader>
        {isEditing ? (
          <EthTextField
            value={amount}
            error={!!error.amount}
            helperText={error.amount && this.errorText('amount')}
            onChange={(amt) => {
              this.setKeyWithErrors('amount', amt)
            }}
          />
        ) : (
          <div>
            <div className={classes.amountRemaining}>
              <EthBalance
                big
                positive={isOwned}
                negative={!isOwned}
              >
                {isClosed ? amount : amountRemaining}
              </EthBalance>
              {this.paid()}
            </div>
            {(amountPaid > 0 && !isPaid) && (
            <div className={classes.amountOriginal}>
              {'out of '}
              <EthBalance>
                {amount}
              </EthBalance>
            </div>
            )}
          </div>
        )}

      </div>
    )
  }

  paid = () => {
    const {
      classes,
    } = this.props
    const {
      isClosed,
      pctPaid,
    } = this.state

    if (isClosed) {
      return (
        <div className={classNames(classes.status, classes.paid)}>
          <DoneIcon fontSize="small" />
          <span>Paid</span>
        </div>
      )
    }


    return (
      <div className={classNames(classes.status, classes.unpaid)}>
        {pctPaid > 0 ? (
          <DoneIcon fontSize="small" />
        ) : (
          <WarningIcon fontSize="small" />
        )}
        <span>
          {pctPaid > 0
            ? `Paid ${Math.round(pctPaid)}%`
            : 'Unpaid'}
        </span>
      </div>
    )
  }

  description = () => {
    const {
      isEditing,
      classes,
    } = this.props
    const {
      date,
      description,
      error,
    } = this.state

    return (
      <div className={classes.attribute}>
        <SmallHeader>
      For
        </SmallHeader>
        {isEditing ? (
          <TextField
            value={description}
            placeholder="Enter a short description"
            error={!!error.description}
            helperText={error.description && this.errorText('description')}
            onChange={(e) => {
              this.setKeyWithErrors('description', e.target.value)
            }}
          />
        ) : (
          <React.Fragment>
            <div className={classes.description}>
              {description}
            </div>
            <div className={classes.date}>
              {moment.unix(date).format('MMM D, YYYY')}
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }

  date = () => {
    const {
      classes,
    } = this.props
    const {
      date,
      error,
    } = this.state

    return (
      <div className={classes.attribute}>
        <SmallHeader>
        Date
        </SmallHeader>
        <TextField
          type="date"
          value={moment.unix(date).format('YYYY-MM-DD')}
          error={!!error.date}
          helperText={error.date && this.errorText('date')}
          onChange={(e) => {
            this.setKeyWithErrors('date', moment(e.target.value).unix())
          }}
        />
      </div>
    )
  }

  footer = () => {
    const {
      createOrUpdate,
    } = this
    const {
      actions,
      bill,
      isNew,
      isCreating,
      isEditing,
      isUpdating,
      isSending,
    } = this.props
    const {
      isOwned,
      isPaid,
      isClosed,
      markedPaid,
    } = this.state


    const footerProps = {
      billId: bill.id,
      markedPaid,
      isNew,
      isCreating,
      isEditing,
      isUpdating,
      isSending,
      isOwned,
      isPaid,
      isClosed,
      actions,
      createOrUpdate,
    }

    return (
      <Footer {...footerProps} />
    )
  }

  contactSelect = () => {
    const {
      classes,
    } = this.props
    const {
      target,
      error,
      showContactSelect,
    } = this.state

    return (
      <Dialog
        open={showContactSelect}
        classes={{
          paper: classes.contactSelect,
        }}
        onClose={() => {
          this.setState({
            showContactSelect: false,
          })
        }}
        aria-labelledby="contacts-select-title"
      >
        <DialogTitle id="contacts-select-title">
      Select Contact
        </DialogTitle>
        <DialogContent
          classes={{
            root: classes.contactSelectContent,
          }}
        >
          <UserContacts
            modal
            selected={target || {}}
            onSelect={(contact) => {
              this.setState({
                error: {
                  ...error,
                  target: null,
                },
                target: contact.username,
              })
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.setState({
                showContactSelect: false,
              })
            }}
            variant="contained"
            color="primary"
          >
        Done
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const {
      bill,
      isReady,
      isEditing,
      classes,
    } = this.props
    const {
      amountPaid,
      fadeIn,
    } = this.state

    if (!isReady) {
      return (
        <Fade in={fadeIn}>
          <Paper className={classes.root} elevation={12}>
            {this.titleBar()}
            <Loader size={40} />
          </Paper>
        </Fade>
      )
    }

    return (
      <Fade in={fadeIn}>
        <Paper className={classes.root} elevation={12}>
          {this.titleBar()}
          <Grid container spacing={16}>
            <Grid item xs={12} sm={5}>
              {this.user()}
            </Grid>
            <Grid className={classes.attributes} item xs={12} sm={7}>
              {this.amount()}
              {this.description()}
              {isEditing && this.date()}
            </Grid>
            {(!isEditing && amountPaid > 0) && (
              <Grid item xs={12}>
                <Payments billId={bill.id} />
              </Grid>
            )}
          </Grid>
          {this.footer()}
          {isEditing && this.contactSelect()}
        </Paper>
      </Fade>
    )
  }
}
