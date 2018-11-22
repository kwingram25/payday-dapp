import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { billsDelete } from 'actions/bills'

import RouteDialog from 'components/RouteDialog'

export default connect(
  ({ router }) => ({
    billId: router.location.hash.replace(/#/g, ''),
  }),
  dispatch => ({
    actions: bindActionCreators({
      billsDelete,
    }, dispatch),
  }),
)(({ actions, billId }) => (
  <RouteDialog {...{
    routeRegex: /\/bill\/delete/,
    dialogContent: (
      <DialogContentText>
        Delete this bill?
      </DialogContentText>
    ),
    dialogActions: exit => (
      [
        <Button
          color="default"
          onClick={exit}
        >
          Cancel
        </Button>,
        <Button
          onClick={() => {
            actions.billsDelete([billId])
          }}
          variant="contained"
          color="secondary"
        >
          Confirm
        </Button>,
      ]
    ),
  }}
  />
))