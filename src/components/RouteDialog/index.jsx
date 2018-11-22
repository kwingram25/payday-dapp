import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'connected-react-router'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

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
class RouteDialog extends React.Component {
  state = {
    open: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      open: props.match,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isMatch } = this.props
    if (isMatch !== nextProps.isMatch) {
      this.setState({ open: nextProps.match })
    }
  }

  exit = () => {
    this.setState({ open: false })
  }

  render() {
    const {
      actions,
      id,
      dialogTitle,
      dialogContent,
      dialogActions = () => null,
      dialogTitleProps = {},
      dialogContentProps = {},
      dialogActionsProps = {},
      isMatch,
      ...rest
    } = this.props
    const { open } = this.state

    const dialogProps = {
      open,
      onBackdropClick: this.exit,
      onExited: actions.goBack,
      ...(dialogTitle ? { 'aria-labelledby': id } : {}),
    }

    return (
      <Dialog {...dialogProps} {...rest}>
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
