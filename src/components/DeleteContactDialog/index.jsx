import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import gett from 'lodash.get'

import Button from '@material-ui/core/Button'
import DialogContentText from '@material-ui/core/DialogContentText'
import withStyles from '@material-ui/core/styles/withStyles'

import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'

import { contactsDelete } from 'actions/contacts'
import { dashboard } from 'actions/navigation'

import Loader from 'components/Loader'
import RouteDialog from 'components/RouteDialog'
import UserInfo from 'components/UserInfo'

import { iconButtonStyles } from '../styles'
import styles from './styles'

export default
@connect(
  ({ router, contacts }) => {
    const isReady = !!contacts.data

    if (!isReady) {
      return { isReady }
    }

    const username = gett(router, ['location', 'state', 'username'])
    const contact = gett(contacts.data, username)

    const isValid = !!username && !!contact
    if (!isValid) {
      return {
        isReady,
        isValid,
      }
    }

    return {
      isValid,
      isReady,
      contact,
    }
  },
  dispatch => ({
    actions: bindActionCreators({
      contactsDelete,
      dashboard,
    }, dispatch),
  }),
)
@withStyles(theme => ({
  ...styles(theme),
  ...iconButtonStyles(theme),
}))
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
      classes, isReady, isValid, contact,
    } = this.props

    if (!isReady || !isValid) {
      return (
        <Loader size={40} />
      )
    }

    return (
      <div>
        <UserInfo
          className={classes.userInfo}
          user={contact}
        />
        <DialogContentText>
          Delete this contact? Your shared bills will no longer appear
          {' '}
          in your dashboard until you add them as a contact again.
        </DialogContentText>
      </div>
    )
  }

  render() {
    const {
      contact, isReady, actions, classes,
    } = this.props
    return (
      <RouteDialog {...{
        id: 'delete-contact',
        routeRegex: /\/contact\/delete/,
        maxWidth: 'xs',
        dialogContent: this.dialogContent(),
        dialogActions: exit => [
          <Button
            key="cancel-button"
            color="default"
            variant="outlined"
            onClick={exit}
          >
            <CloseIcon className={classes.buttonIcon} />
            Cancel
          </Button>,
          <Button
            key="confirm-button"
            onClick={() => {
              actions.contactsDelete(contact.username)
              exit()
            }}
            disabled={!isReady}
            variant="contained"
            color="secondary"
          >
            <DeleteIcon className={classes.buttonIcon} />
            Confirm
          </Button>,
        ],

      }}
      />
    )
  }
}
