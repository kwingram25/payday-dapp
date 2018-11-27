import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import withStyles from '@material-ui/core/styles/withStyles'

import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import CloseIcon from '@material-ui/icons/Close'

import { setNotification } from 'actions/ui'

import styles from './styles'

export default
@connect(
  ({ ui }) => ({
    open: !!ui.notification,
    text: ui.notification,
  }),
  dispatch => ({
    actions: bindActionCreators({
      setNotification,
    }, dispatch),
  }),
)
@withStyles(styles)
class Notification extends React.Component {
  state = {
    text: null,
  }

  componentWillReceiveProps(nextProps) {
    const { text } = this.state
    this.setState({
      text: nextProps.text || text,
    })
  }

  render() {
    const {
      open, actions, classes,
    } = this.props
    const {
      text,
    } = this.state
    const snackbarProps = {
      open,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 5000,
      onClose: () => actions.setNotification(null),
    }
    const snackbarContentProps = {
      className: classes.content,
      message: (
        <span id="notification">
          {text}
        </span>
      ),
      action: (
        <IconButton
          className={classes.closeButton}
          key="close"
          aria-label="Close"
          color="primary"
          onClick={() => actions.setNotification(null)}
        >
          <CloseIcon />
        </IconButton>
      ),
    }
    return (
      <Snackbar {...snackbarProps}>
        <SnackbarContent {...snackbarContentProps} />
      </Snackbar>
    )
  }
}
