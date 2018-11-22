import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SendIcon from '@material-ui/icons/Send'

import { billsMarkAsPaid } from 'actions/bills'
import { editBill, viewBill, deleteBill } from 'actions/navigation'
import { setDashboardFilter, setDashboardShowArchived } from 'actions/ui'

import EthBalance from 'components/EthBalance'
import UserAvatar from 'components/UserAvatar'

import {
  BillRow,
  DetailsCell,
  AmountCell,
  DateCell,
  ActionsCell,
  Description,
  AmountPaid,
} from './views'

export default
@connect(
  ({ contacts }, { bill }) => {
    const { isOwned, target, owner } = bill
    return {
      contact: contacts.data[isOwned ? target : owner],
    }
  },
  dispatch => ({
    actions: {
      ...bindActionCreators({
        editBill,
        viewBill,
        deleteBill,
        billsMarkAsPaid,
        setDashboardFilter,
        setDashboardShowArchived,
      }, dispatch),
    },
  }),
)
class DashboardTableRow extends React.Component {
  descriptionText = () => {
    const {
      bill: {
        description,
        isOwned,
        isPaid,
      },
      contact: {
        username,
        name,
      },
    } = this.props

    return (
      <Description>
        {isPaid && !isOwned}
        {!isOwned && `You ${isPaid ? 'paid' : 'owe'} `}
        <b>{name || username.split('.')[0]}</b>
        {isOwned && ` ${isPaid ? 'paid' : 'owes'} you`}
        {' for '}
        <b>{description}</b>
      </Description>
    )
  }

  render() {
    const { bill, contact } = this.props

    if (!bill || !contact) {
      return null
    }

    const {
      bill: {
        id,
        date,
        amount,
        amountPaid = 0,
        isOwned,
        isPaid,
      },
      contact: {
        username,
        name,
        avatarUrl,
      },
      actions,
    } = this.props

    return (
      <BillRow
        isPaid={isPaid}
        hover
        to={`/bill/${id}`}
        tabIndex={-1}
        key={id}
      >
        <DateCell onClick={() => {
          actions.viewBill(id)
        }}
        >
          {moment.unix(date).format('MMM D')}
        </DateCell>
        <DetailsCell
          onClick={() => {
            actions.viewBill(id)
          }}
        >
          <div>
            <UserAvatar {...{ name, username, avatarUrl }} />
            {this.descriptionText()}
            {(!isPaid && amountPaid > 0) && (
              <AmountPaid>
                {Math.round(100 * (amountPaid / amount))}
% Paid
              </AmountPaid>
            )}
          </div>
        </DetailsCell>
        <AmountCell
          onClick={() => {
            actions.viewBill(id)
          }}
        >
          <EthBalance
            quantity={isPaid ? amount : amount - amountPaid}
            variant={isOwned ? 'positive' : 'negative'}
          />
        </AmountCell>
        <ActionsCell>
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
                          actions.billsMarkAsPaid(id)
                        }}
                      >
                        <ListItemIcon>
                          <DoneIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mark as Paid" />
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        actions.editBill(id)
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
                      }}
                    >
                      <ListItemIcon>
                        <DeleteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Delete Bill" />
                    </MenuItem>
                  </Menu>
                ) : (
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      onClick={() => {
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
                )}
              </React.Fragment>
            )}
          </PopupState>
        </ActionsCell>
      </BillRow>
    )
  }
}
