import React from 'react'
import { connect } from 'react-redux'

import withStyles from '@material-ui/core/styles/withStyles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CircularProgress from '@material-ui/core/CircularProgress'

import styles from './styles'

export default
connect(
  ({ payments }) => ({
    open: payments.creating,
  }),
)(
  withStyles(styles)(({ open, classes }) => {
    const snackbarProps = {
      open,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      // autoHideDuration: 5000,
      // onClose: () => actions.setNotification(null),
    }
    const snackbarContentProps = {
      className: classes.root,
      message: (
        <div className={classes.message}>
          <CircularProgress size={16} className={classes.progress} />
          Processing your payment...
        </div>
      ),
      // action: (
      //   <CloseButton
      //     key="close"
      //     aria-label="Close"
      //     color="primary"
      //     onClick={() => actions.setNotification(null)}
      //   >
      //     <CloseIcon />
      //   </CloseButton>
      // ),
    }
    return (
      <Snackbar {...snackbarProps}>
        <SnackbarContent {...snackbarContentProps} />
      </Snackbar>
    )
  }),
)
