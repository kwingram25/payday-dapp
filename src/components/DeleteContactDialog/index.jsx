import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { contactsDelete } from 'actions/contacts'

import RouteDialog from 'components/RouteDialog'

export default connect(
  ({ router }) => ({
    username: router.location.state && router.location.state.username,
  }),
  dispatch => ({
    actions: bindActionCreators({
      contactsDelete,
    }, dispatch),
  }),

)(({ username, actions }) => (
  <RouteDialog {...{
    routeRegex: /\/contact\/delete/,
    maxWidth: 'xs',
    dialogContent: (
      <DialogContentText>
        Delete this contact? Your shared bills will no longer appear in your dashboard until you add them as a contact again.
      </DialogContentText>
    ),
    dialogActions: exit => [
      <Button
        color="default"
        onClick={exit}
      >
              Cancel
      </Button>,
      <Button
        onClick={() => {
          actions.contactsDelete(username)
          exit()
        }}
        variant="contained"
        color="secondary"
      >
              Confirm
      </Button>,
    ],

  }}
  />
))
