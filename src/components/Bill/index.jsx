import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import get from 'lodash.get'
// import blockies from 'ethereum-blockies'
// import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
// import copy from 'copy-to-clipboard'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ButtonBase from '@material-ui/core/ButtonBase'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/InputAdornment'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fade from '@material-ui/core/Fade'

import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import CloseIcon from '@material-ui/icons/Close'

// import AccountCircle from '@material-ui/icons/AccountCircle'
// import MoreVertIcon from '@material-ui/icons/MoreVert'

// aria-owns={open ? 'long-menu' : undefined}

import {
  billsCreate,
  billsUpdate,
  billsDelete,
  billsMarkAsPaid,
  billsCreateError,
} from 'actions/bills'
import {
  dashboard,
} from 'actions/navigation'

import EthBalance from 'components/EthBalance'
import EthTextField from 'components/EthTextField'
import UserAvatar from 'components/UserAvatar'
import UserContacts from 'components/UserContacts'
import Loader from 'components/Loader'
import { SmallHeader } from 'components/views'

import { billId } from 'utils'

import {
  styles,
  BillWrapper,
  BillHeader,
  BillFooter,
  BillFooterButtons,
  BillTitle,
  BillAttributes,
  BillAttribute,
  BillAmount,
  BillAmountOutstanding,
  BillAmountOriginal,
  BillDate,
  BillDescription,
  UsersInvolved,
  UserView,
  UserName,
  UserUsername,
  UserInvolvedAvatar,
  UserMissingAvatar,
  Paid,
  Outstanding,
  EditButton,
  DeleteButton,
  PayButton,
  MarkPaidButton,
} from './views'

// import {
//   UserInfo,
//   UserPic,
//   UserName,
//   UserUsername,
//   UserOptionsButton,
// } from './views'

export default
@withStyles(styles)
@connect(
  ({
    auth, bills, contacts, router,
  }) => {
    const id = router.location.hash.replace(/#/g, '')
    const isNew = /\/new$/.test(router.location.pathname)
    // const isLoaded = contacts.data && bills.data && bills.data[id]

    let bill = null
    if (isNew) {
      bill = {
        isOwned: true,
        owner: auth.user,
        target: router.location.state && router.location.state.contact,
      }
    } else if (bills.data && bills.data[id]) {
      const {
        owner, target, isOwned,
      } = bills.data[id]
      bill = {
        ...bills.data[id].toJSON(true),
        owner: isOwned ? auth.user : contacts.data[owner],
        target: isOwned ? contacts.data[target] : auth.user,
      }
    }

    return {
      id,
      user: auth.user,
      bill,
      error: bills.error,
      isInvalid: !bill && bills.data,
      isCreating: bills.working === 'create',
      isUpdating: bills.working === 'update',
      isDeleting: bills.working === 'delete',
      isNew,
      isEditing: isNew || /\/edit/.test(router.location.pathname),
    }
  },
  dispatch => ({
    actions: {
      ...bindActionCreators({
        billsCreate,
        billsUpdate,
        billsDelete,
        billsMarkAsPaid,
        billsError: billsCreateError,
        dashboard,
      }, dispatch),
    },
  }),
  null,
  {
    areStatesEqual: (next, prev) => {
      if (!prev.bills.data && next.bills.data) {
        return false
      }
      return prev.router.location === next.router.location
        || get(next.router, ['location', 'state', 'modal'])
    },
  },
)
class Bill extends React.Component {
  defaultState = {
    id: null,
    owner: null,
    target: null,
    amount: '',
    description: '',
    date: moment().unix(),
    showContactSelect: false,
  }

  state = {
    ...this.defaultState,
    fadeIn: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      // bill: props.bill,
      // owner: props.owner || props.user,
      // target: props.target || null,
      ...(
        props.bill
          ? props.bill
          : {}
      ),
    }
  }

  componentWillMount() {
    const { actions, isInvalid } = this.props
    if (isInvalid) {
      actions.dashboard()
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      bill, owner, target, error, isEditing, isNew, actions,
    } = this.props
    // if (nextProps.id && !nextProps.isEditing && !nextProps.target) {
    //   this.props.actions.dashboard()
    // }
    console.log(nextProps)
    if (nextProps.invalid) {
      actions.dashboard()
      // return
    }
    if (nextProps.error !== error) {
      this.setState({ error: nextProps.error })
    }
    if (nextProps.bill !== bill
      || isEditing !== nextProps.isEditing
      || isNew !== nextProps.isNew) {
      this.setState({
        ...this.defaultState,
        ...nextProps.bill,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {


    if (this.state.showContactSelect !== nextState.showContactsSelect) {
      return true
    }
    if (this.props.bill === nextProps.bill || !(nextProps.id || nextProps.isNew)) {
      console.log('blocked')
      return false
    }
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.match)
    console.log(this.props.match)
    Object.entries(this.props).forEach(([key, val]) => prevProps[key] !== val && console.log(`Prop '${key}' changed`))
    Object.entries(this.state).forEach(([key, val]) => prevState[key] !== val && console.log(`State '${key}' changed`))
  }

  componentWillUnmount() {
    this.setState({ fadeIn: false })
  }

  // componentDidUpdate(prevProps, prevState) {
  //   Object.entries(this.props).forEach(([key, val]) => {
  //     if (prevProps[key] !== val) {
  //       console.log(`Prop '${key}' changed`)
  //       console.log('was', prevProps[key])
  //       console.log('now', val)
  //     }
  //   })
  //   Object.entries(this.state).forEach(([key, val]) => prevState[key] !== val && console.log(`State '${key}' changed`))
  // }

  // componentWillMount() {
  //   const { actions, ready } = this.props
  //   if (!ready) {
  //     actions.userAccountFetch()
  //   }
  // }

  createOrUpdate = () => {
    const {
      actions,
      user,
      isNew,
    } = this.props

    const {
      id,
      owner,
      target,
      amount,
      date,
      description,
      showContactSelect,
    } = this.state

    if (target.username === user.username) {
      return
    }

    if (amount <= 0) {
      actions.billsError('amount')
    }

    const data = {
      owner: owner.username,
      target: target.username,
      amount,
      date: date || moment().unix(),
      description: description || 'unknown',
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
    } = this.props

    return (
      <AppBar color="default" position="absolute">
        <Toolbar>
          <BillTitle>
            {(() => {
              if (isEditing) {
                return (isNew ? 'New Bill' : 'Edit Bill')
              }
              return 'View Bill'
            })()}
          </BillTitle>
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

  render() {
    console.log('Bill', Date.now())
    const {
      createOrUpdate,
    } = this
    const {
      actions,
      user,
      bill,
      isNew,
      isCreating,
      isEditing,
      isUpdating,
      classes,
      history,
    } = this.props
    const {
      id,
      isOwned,
      isPaid,
      owner,
      target,
      amount,
      amountPaid,
      date,
      description,
      error,
      showContactSelect,
      fadeIn,
    } = this.state

    if (!bill) {
      return (
        <Fade in={fadeIn}>
          <BillWrapper elevation={12}>
            {this.titleBar()}
            <Loader size={40} />
          </BillWrapper>
        </Fade>
      )
    }

    const displayUser = (isOwned ? target : owner) || null

    return (
      <Fade in={fadeIn}>
        <BillWrapper elevation={12}>
          {this.titleBar()}
          <Grid container spacing={12}>
            <Grid item xs={12} sm={5}>
              <UserView>
                <UserAvatar
                  size={84}
                  style={{
                    margin: '0px auto',
                  }}
                  {...(displayUser || {})}
                />
                <UserName>
                  {displayUser && displayUser.name}
                </UserName>
                <UserUsername>
                  {displayUser && displayUser.username}
                </UserUsername>
                {isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({ showContactSelect: true })
                  }}
                >
                  Change
                </Button>
                )}
              </UserView>
            </Grid>
            <BillAttributes item xs={12} sm={7}>
              <BillAttribute>
                <SmallHeader>
                  {isOwned ? 'Owes You' : 'You Owe'}
                </SmallHeader>
                {isEditing ? (
                  <EthTextField
                    value={amount}
                    error={error === 'amount'}
                    helperText={error === 'amount' ? 'Invalid amount' : null}
                    onChange={(amt, isValid) => {
                      this.setState({
                        error: !isValid && 'amount',
                        amount: amt,
                      })
                    }}
                  />
                ) : (
                  <BillAmount>
                    <BillAmountOutstanding>
                      <EthBalance
                        style={{
                          fontSize: '28px',
                        }}
                        quantity={isPaid ? amount : amount - amountPaid}
                        variant={isOwned ? 'positive' : 'negative'}
                      />
                      {isPaid ? <Paid /> : <Outstanding {...{ amount, amountPaid }} />}
                    </BillAmountOutstanding>
                    {(amountPaid > 0 && !isPaid) && (
                    <BillAmountOriginal>
                      {'out of '}
                      <EthBalance
                        style={{
                          fontSize: 'inherit !important',
                        }}
                        quantity={amount}
                      />
                    </BillAmountOriginal>
                    )}
                  </BillAmount>
                )}

              </BillAttribute>
              <BillAttribute>
                <SmallHeader>
                For
                </SmallHeader>
                {isEditing ? (
                  <TextField
                    value={description}
                    placeholder="Enter a short description"
                    onChange={(e) => {
                      this.setState({
                        description: e.target.value,
                      })
                    }}
                  />
                ) : (
                  <React.Fragment>
                    <BillDescription>
                      {description}
                    </BillDescription>
                    <BillDate>
                      {moment.unix(date).format('MMM D, YYYY')}
                    </BillDate>
                  </React.Fragment>
                )}
              </BillAttribute>
              {isEditing && (
              <BillAttribute>
                <SmallHeader>
                Date
                </SmallHeader>
                <TextField
                  type="date"
                  defaultValue={moment().format('YYYY-MM-DD')}
                  value={moment.unix(date).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    this.setState({
                      date: moment(e.target.value).unix(),
                    })
                  }}
                />
              </BillAttribute>
              )}
            </BillAttributes>

          </Grid>
          <BillFooter>
            {!isOwned && (
            <PayButton
              component={Link}
              to={`/bill/pay#${bill.id}`}
            />
            )}
            {(isOwned && !isEditing) && (
            <React.Fragment>
              <BillFooterButtons style={{ flexGrow: 1 }}>
                <DeleteButton
                  component={Link}
                  to={`/bill/delete#${bill.id}`}
                />
                <EditButton
                  component={Link}
                  to={`/bill/edit#${bill.id}`}
                />
              </BillFooterButtons>
              <MarkPaidButton
                disabled={isPaid}
                onClick={() => {
                  actions.billsMarkAsPaid(id)
                }}
              />

            </React.Fragment>
            )}
            {(isEditing || isNew) && (
            <React.Fragment>
              <Button
                onClick={() => {
                  history.goBack()
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                disabled={isCreating || isUpdating}
                onClick={createOrUpdate}
              >
                {(() => {
                  if ((isCreating && isNew) || (isUpdating && !isNew)) {
                    return <CircularProgress size={12} />
                  }
                  return isNew ? 'Create' : 'Save'
                })()}
              </Button>
            </React.Fragment>
            )}
          </BillFooter>
          {isEditing && (
          <Dialog
            open={showContactSelect}
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
            <DialogContent>
              <UserContacts
                modal
                selected={target || {}}
                onSelect={(contact) => {
                  this.setState({ target: contact })
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
          )}
        </BillWrapper>
      </Fade>
    )
  }
}
