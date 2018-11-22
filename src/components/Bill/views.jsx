import React from 'react'
import styled from 'styled-components'

import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ButtonBase from '@material-ui/core/ButtonBase'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import Dialog from '@material-ui/core/Dialog'

import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SendIcon from '@material-ui/icons/Send'

import Done from '@material-ui/icons/Done'
import Warning from '@material-ui/icons/Warning'

import UserAvatar from 'components/UserAvatar'

export const styles = {
  ethFontSize: {
    // fontSize: '19px !important',
  },
  ethSymbol: {
    fontWeight: 200,
    opacity: 0.7,
  },
}

const buttonWithIconStyles = {
  icon: {
    marginRight: '12px',
    fontSize: '20px',
  },
}

export const BillWrapper = styled(Paper)`
  position: relative;
  padding: 96px 32px 62px;
  max-width: 1000px;
  min-height: 390px;
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
`

export const BillTitle = ({ children }) => {
  const Component = styled(Typography)`
    flex-grow: 1;
  `
  return (
    <Component variant="h6">
      {children}
    </Component>
  )
}

export const BillAttributes = styled(Grid)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `

export const BillAttribute = styled.div`
  min-height: 92px;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const BillDate = styled.div`
  font-size: 15px;
  color: #aaa;
`

export const BillAmount = styled.div``

export const BillAmountOutstanding = styled.div`
  display: inline-flex;
`
export const BillAmountOriginal = styled.div`
  font-size: 15px;
  color: #aaa;

  & > * {
    display: inline;
  }
`

export const BillDescription = styled.div`
  font-weight: 500;
  font-size: 19px;
`

export const BillHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 84px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 28px;
`

export const BillFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  margin: 0 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 12px;
  }
`

export const BillFooterButtons = styled.div`
  & > :not(:first-child) {
    margin-left: 12px;
  }
`

export const UsersInvolved = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const UserView = styled.div`
  width: 100%;
  display: block !important;
  text-align: center;
  flex-basis: 200px;
`

export const UserName = ({ children }) => ((
  <Typography
    variant="h6"
    style={{
      marginTop: '12px',
    }}
  >
    {children}
  </Typography>
))

export const UserUsername = styled.div`
  color: #bbb;
  font-size: 12px;
  margin-bottom: 32px;
`

export const EthTextField = withStyles({
  root: {
    fontSize: '22px !important',
  },
})(TextField)

export const UserMissingAvatar = () => (
  <Avatar
    size={48}
  >
    ?
  </Avatar>
)

export const UserInvolvedAvatar = props => (
  <UserAvatar
    style={{

    }}
    size={48}
    {...props}
  />
)

export const EditButton = withStyles(
  buttonWithIconStyles,
)(({ classes, ...props }) => (
  <Button
    variant="outlined"
    {...props}
  >
    <EditIcon className={classes.icon} />
      Edit
  </Button>
))

export const DeleteButton = withStyles(
  buttonWithIconStyles,
)(({ classes, ...props }) => (
  <Button
    color="secondary"
    variant="outlined"
    {...props}
  >
    <DeleteIcon className={classes.icon} />
      Delete
  </Button>
))

export const PayButton = withStyles(
  buttonWithIconStyles,
)(({ classes, ...props }) => (
  <Button
    color="primary"
    variant="outlined"
    {...props}
  >
    <SendIcon className={classes.icon} />
      Pay Now
  </Button>
))

export const MarkPaidButton = withStyles(
  buttonWithIconStyles,
)(({ classes, ...props }) => (
  <Button
    color="primary"
    variant="outlined"
    {...props}
  >
    <DoneIcon className={classes.icon} />
      Mark as Paid
  </Button>
))

const Status = styled.div`
  margin-left: 16px;
  font-size: 15px;
  display: flex;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 3px;
  }
`

const DoneIcon = styled(Done)`
  fontSize: 15px !important;
`

const WarningIcon = styled(Warning)`
  fontSize: 15px !important;
`

const GreenStatus = styled(Status)`
  color: green;
`

export const Paid = () => {
  return (
    <GreenStatus>
      <DoneIcon fontSize="small" />
      <span>Paid</span>
    </GreenStatus>
  )
}

const YellowStatus = styled(Status)`
  color: yellow;
`

export const Outstanding = ({ percent }) => {

  if (!percent) {
    return (
      <YellowStatus>
        <WarningIcon fontSize="small" />
        <span>Unpaid</span>
      </YellowStatus>
    )
  }

  const percentage = Math.round(percent)

  return (
    <YellowStatus>
      <DoneIcon fontSize="small" />
      <span>
        {percentage}
        % Paid
      </span>
    </YellowStatus>
  )
}

export const ContactSelectDialog = styled(Dialog)`
  width: 300px;
  min-height: 500px;
`
