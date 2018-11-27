import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import classNames from 'classnames'

import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import withStyles from '@material-ui/core/styles/withStyles'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SendIcon from '@material-ui/icons/Send'
import CloseIcon from '@material-ui/icons/Close'

import { billsMarkAsPaid } from 'actions/bills'
import {
  editBill, viewBill, deleteBill, payBill,
} from 'actions/navigation'
import { setDashboardFilter, setDashboardShowArchived } from 'actions/ui'

import EthBalance from 'components/EthBalance'
import UserAvatar from 'components/UserAvatar'

// import {
//   BillRow,
//   DetailsCell,
//   AmountCell,
//   DateCell,
//   ActionsCell,
//   Description,
//   AmountPaid,
// } from './views'
import { cellStyles } from '../styles'
import styles from './styles'

export default
@connect(
  ({ bills, contacts, payments }, { id }) => {
    const bill = bills.data && bills.data[id]

    if (!bill) {
      return { isValid: false }
    }

    const { isOwned, target, owner } = bill
    const contact = contacts.data && contacts.data[isOwned ? target : owner]

    return {
      isValid: contact && true,
      bill: bill && bill.toObject(true),
      contact: contacts.data[isOwned ? target : owner],
      isSending: payments.creating,
    }
  },
  dispatch => ({
    actions: {
      ...bindActionCreators({
        editBill,
        viewBill,
        deleteBill,
        payBill,
        billsMarkAsPaid,
        setDashboardFilter,
        setDashboardShowArchived,
      }, dispatch),
    },
  }),
)
@withStyles(
  theme => ({
    ...styles(theme),
    ...cellStyles(theme),
  }),
)
class DashboardTableRow extends React.Component {
  descriptionText = () => {
    const {
      bill: {
        description,
        isOwned,
        isClosed,
      },
      contact: {
        username,
        name,
      },
      classes,
    } = this.props

    return (
      <div className={classes.description}>
        {!isOwned && `You ${isClosed ? 'paid' : 'owe'} `}
        <b>{name || username.split('.')[0]}</b>
        {isOwned && ` ${isClosed ? 'paid' : 'owes'} you`}
        {' for '}
        <b>{description}</b>
      </div>
    )
  }

  render() {
    const { isValid } = this.props

    if (!isValid) {
      return null
    }

    const {
      bill: {
        id,
        date,
        amount,
        amountPaid,
        amountRemaining,
        pctPaid,
        markedPaid,
        isPaid,
        isOwned,
        isClosed,
        isSending,
      },
      contact: {
        username,
        name,
        avatarUrl,
      },
      actions,
      classes,
    } = this.props

    const hasActions = !isClosed || isOwned

    return (
      <TableRow
        className={classNames(
          classes.baseRow,
          isClosed && classes.archivedRow,
        )}
        hover
        tabIndex={-1}
        key={id}
      >
        <TableCell
          classes={{
            root: classNames(classes.base, classes.date),
          }}

          onClick={() => {
            actions.viewBill(id)
          }}
        >
          {moment.unix(date).format('MMM D')}
        </TableCell>
        <TableCell
          classes={{
            root: classNames(classes.base, classes.details),
          }}
          onClick={() => {
            actions.viewBill(id)
          }}
        >
          <div>
            <UserAvatar {...{ name, username, avatarUrl }} />
            {this.descriptionText()}
            {(!isClosed && amountPaid > 0) && (
              <div className={classes.amountPaid}>
                {Math.round(pctPaid)}
                % Paid
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          classes={{
            root: classNames(classes.base, classes.amount),
          }}
          onClick={() => {
            actions.viewBill(id)
          }}
        >
          <EthBalance positive={isOwned} negative={!isOwned}>
            {isClosed ? amount : amountRemaining}
          </EthBalance>
        </TableCell>
        <TableCell
          classes={{
            root: classNames(classes.base, classes.actions),
          }}
        >
          {hasActions && (
            <PopupState variant="popover" popupId="demoMenu">
              {popupState => (
                <React.Fragment>
                  <IconButton
                    aria-label="More"
                    aria-haspopup="true"
                    {...bindTrigger(popupState)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  {isOwned ? (
                    <Menu {...bindMenu(popupState)}>
                      {!isPaid && (
                        <MenuItem
                          onClick={() => {
                            actions.billsMarkAsPaid(id, !markedPaid)
                            popupState.close()
                          }}
                        >
                          <ListItemIcon>
                            {markedPaid ? <CloseIcon /> : <DoneIcon />}
                          </ListItemIcon>
                          <ListItemText primary={markedPaid ? 'Mark as Unpaid' : 'Mark as Paid'} />
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          actions.editBill(id)
                          popupState.close()
                        }}
                      >
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        <ListItemText primary="Edit Bill" />
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          actions.deleteBill(id)
                          popupState.close()
                        }}
                      >
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Delete Bill" />
                      </MenuItem>
                    </Menu>
                  ) : (!isSending && (
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem
                        onClick={() => {
                          actions.payBill(id)
                          popupState.close()
                        }}
                      >
                        <ListItemIcon>
                          <SendIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Pay Now"
                        />
                      </MenuItem>
                    </Menu>
                  ))}
                </React.Fragment>
              )}
            </PopupState>
          )}
        </TableCell>
      </TableRow>
    )
  }
}
