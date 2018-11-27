import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import gett from 'lodash.get'

import Button from '@material-ui/core/Button'
import DialogContentText from '@material-ui/core/DialogContentText'
import withStyles from '@material-ui/core/styles/withStyles'

import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'

import { billsDelete } from 'actions/bills'
import { dashboard } from 'actions/navigation'

import RouteDialog from 'components/RouteDialog'
import BillInfo from 'components/BillInfo'
import Loader from 'components/Loader'
import { iconButtonStyles } from 'components/styles'

export default
@connect(
  ({ bills, contacts, router }) => {
    const isReady = !!bills.data && !!contacts.data

    if (!isReady) {
      return { isReady }
    }

    const billId = router.location.hash.replace(/#/g, '')

    const bill = gett(bills.data, billId)

    const isValid = !!bill
    if (!isValid) {
      return {
        isReady,
        isValid,
      }
    }
    const { isOwned, owner, target } = bill

    const contact = gett(contacts.data, isOwned ? target : owner)

    return {
      isValid,
      isReady,
      bill: bill.toObject(true),
      contact,
    }
  },
  dispatch => ({
    actions: bindActionCreators({
      billsDelete,
      dashboard,
    }, dispatch),
  }),
)
@withStyles(iconButtonStyles)
class DeleteContactDialog extends React.Component {
  componentWillMount() {
    const { actions, isReady, isValid } = this.props
    if (isReady && !isValid) {
      actions.dashboard()
    }
  }

  componentWillReceiveProps({ isReady, isValid }) {
    const { actions } = this.props
    if (isReady && !isValid) {
      actions.dashboard()
    }
  }

    dialogContent = () => {
      const {
        isReady, isValid, bill, contact,
      } = this.props

      if (!isReady || !isValid) {
        return (
          <Loader size={40} />
        )
      }

      return (
        <div>
          <BillInfo bill={bill} contact={contact} />
          <DialogContentText>
            Delete this bill?
          </DialogContentText>
        </div>
      )
    }

    render() {
      const {
        actions, isReady, bill, classes,
      } = this.props
      return (
        <RouteDialog {...{
          id: 'delete-bill',
          routeRegex: /\/bill\/delete/,
          dialogContent: this.dialogContent(),
          dialogActions: exit => (
            [
              <Button
                color="default"
                variant="outlined"
                onClick={exit}
              >
                <CloseIcon className={classes.buttonIcon} />
                Cancel
              </Button>,
              <Button
                onClick={() => {
                  exit()
                  actions.billsDelete([bill.id])
                }}
                disabled={!isReady}
                variant="contained"
                color="secondary"
              >
                <DeleteIcon className={classes.buttonIcon} />
                Confirm
              </Button>,
            ]
          ),
        }}
        />
      )
    }
}
