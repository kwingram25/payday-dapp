import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import withStyles from '@material-ui/core/styles/withStyles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import styles from './styles'

export default
@connect(
  ({ router }, { routeRegex }) => ({
    isMatch: routeRegex.test(router.location.pathname),
  }),
  dispatch => ({
    actions: bindActionCreators({
      goBack,
    }, dispatch),
  }),
)
@withStyles(styles)
class RouteDialog extends React.Component {
  state = {
    open: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      open: props.isMatch,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isMatch } = this.props
    if (isMatch !== nextProps.isMatch) {
      this.setState({ open: nextProps.isMatch })
    }
  }

  exit = () => {
    this.setState({ open: false })
  }

  render() {
    const {
      classes,
      actions,
      id,
      dialogTitle,
      dialogContent,
      dialogProps,
      dialogActions = () => null,
      dialogTitleProps = {},
      dialogContentProps = {},
      dialogActionsProps = {},
      isMatch,
      routeRegex,
      ...rest
    } = this.props
    const { open } = this.state

    const props = {
      ...dialogProps,
      open,
      classes: {
        paper: classes.dialog,
      },
      onBackdropClick: this.exit,
      onExited: actions.goBack,
      ...(dialogTitle ? { 'aria-labelledby': id } : {}),
    }

    return (
      <Dialog {...props} {...rest}>
        {dialogTitle && (
          <DialogTitle {...dialogTitleProps}>
            {dialogTitle}
          </DialogTitle>
        )}
        <DialogContent {...dialogContentProps}>
          {dialogContent}
        </DialogContent>
        {dialogActions && (
          <DialogActions {...dialogActionsProps}>
            {dialogActions(this.exit)}
          </DialogActions>
        )}
      </Dialog>
    )
  }
}
