import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import CloseIcon from '@material-ui/icons/Close'

import { showTestModeNotice } from 'actions/ui'

import styles from './styles'

export default
connect(
  ({ payments, ui }) => ({
    open: ui.showTestModeNotice && (!ui.notification && !payments.sending),
  }),
  dispatch => ({
    actions: bindActionCreators({
      showTestModeNotice,
    }, dispatch),
  }),
)(
  withStyles(styles)(({ open, classes, actions }) => {
    const snackbarProps = {
      open,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      onClose: () => actions.showTestModeNotice(false),
    }
    const snackbarContentProps = {
      className: classes.root,
      message: (
        <div className={classes.message}>
          <IconButton
            className={classes.closeButton}
            key="close"
            aria-label="Close"
            color="default"
            onClick={() => actions.showTestModeNotice(false)}
          >
            <CloseIcon />
          </IconButton>
          PayDay is currently running on the
          {' '}
          <b>Rinkeby testnet.</b>
          {' '}
          <br />
          Visit
          {' '}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://faucet.rinkeby.io"
          >
            faucet.rinkeby.io
          </a>
          {' '}
          to request ETH tokens!
        </div>
      ),
    }
    return (
      <Snackbar {...snackbarProps}>
        <SnackbarContent {...snackbarContentProps} />
      </Snackbar>
    )
  }),
)
