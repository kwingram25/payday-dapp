import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import blockies from 'ethereum-blockies'
import { Link } from 'react-router-dom'

// import Button from '@material-ui/core/Button'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'

import DeleteIcon from '@material-ui/icons/Delete'


// import AccountCircle from '@material-ui/icons/AccountCircle'
// import MoreVertIcon from '@material-ui/icons/MoreVert'

// aria-owns={open ? 'long-menu' : undefined}

import {
  contactsDelete,
} from 'actions/contacts'

import UserAvatar from 'components/UserAvatar'

import {
  contactItemStyles as styles,
  // UserInfo,
  // UserPic,
  // UserName,
  // UserUsername,
  // UserOptionsButton,
} from './views'

export default
@connect(
  ({ contacts, router }) => ({
    isDeleting: contacts.working === 'delete',
    error: contacts.error,
    pathname: router.location.pathname,
  }),
  dispatch => ({
    actions: bindActionCreators({
      contactsDelete,
    }, dispatch),
  }),
)
@withStyles(styles)
class UserAccount extends React.Component {
  state = {
    showDeleteButton: false,
  }

  deleteContact = () => {
    const { actions, contact } = this.props
    actions.contactsDelete(contact.username)
  }

  render() {
    const {
      props: {
        classes,
        contact,
        modal,
        onClick,
        selected,
        pathname,
        // isDeleting,
      },
      state: {
        showDeleteButton,
      },
    } = this

    const { username, name, avatarUrl } = contact

    return (
      <ListItem
        key={username}
        button
        selected={selected}
        disableGutters
        {...(modal ? {
          onClick,
        } : {
          component: Link,
          replace: pathname === '/bill/new',
          to: {
            pathname: '/bill/new',
            state: {
              contact,
            },
          },
        })}
      >
        <ListItemAvatar>
          <UserAvatar {...{
            avatarUrl,
            username,
          }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={username}
        />
        {!modal && (
          <ListItemSecondaryAction>
            <IconButton
              className={classes.deleteButton}
              component={Link}
              to={{
                pathname: '/contact/delete',
                state: {
                  modal: true,
                  username,
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}

      </ListItem>
    )
  }
}
