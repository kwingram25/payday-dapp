import React from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'

import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SendIcon from '@material-ui/icons/Send'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'

import { iconButtonStyles } from 'components/styles'

export const EditButton = withStyles(
  iconButtonStyles,
)(({ classes, ...props }) => (
  <Button
    variant="outlined"
    {...props}
  >
    <EditIcon className={classes.buttonIcon} />
      Edit
  </Button>
))

export const DeleteButton = withStyles(
  iconButtonStyles,
)(({ classes, ...props }) => (
  <Button
    color="secondary"
    variant="outlined"
    {...props}
  >
    <DeleteIcon className={classes.buttonIcon} />
      Delete
  </Button>
))

export const PayButton = withStyles(
  iconButtonStyles,
)(({ classes, ...props }) => (
  <Button
    color="primary"
    variant="outlined"
    {...props}
  >
    <SendIcon className={classes.buttonIcon} />
      Pay Now
  </Button>
))

export const MarkPaidButton = withStyles(
  iconButtonStyles,
)(({ classes, ...props }) => (
  <Button
    color="primary"
    variant="outlined"
    {...props}
  >
    <DoneIcon className={classes.buttonIcon} />
      Mark as Paid
  </Button>
))

export const MarkUnpaidButton = withStyles(
  iconButtonStyles,
)(({ classes, ...props }) => (
  <Button
    color="default"
    variant="outlined"
    {...props}
  >
    <CloseIcon className={classes.buttonIcon} />
      Mark as Unpaid
  </Button>
))

export const CancelButton = withStyles(
  iconButtonStyles,
)(({ classes, ...props }) => (
  <Button
    color="default"
    variant="outlined"
    {...props}
  >
    <CloseIcon className={classes.buttonIcon} />
    Cancel
  </Button>
))


export const CreateButton = withStyles(
  iconButtonStyles,
)(({ classes, isNew, ...props }) => (
  <Button
    color="primary"
    variant="contained"
    {...props}
  >
    <DoneIcon className={classes.buttonIcon} />
    {isNew ? 'Create' : 'Update'}
  </Button>
))
