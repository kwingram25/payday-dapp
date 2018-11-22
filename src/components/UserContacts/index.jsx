import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import blockies from 'ethereum-blockies'
import { Link } from 'react-router-dom'

// import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'


import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'


// import AccountCircle from '@material-ui/icons/AccountCircle'
// import MoreVertIcon from '@material-ui/icons/MoreVert'

// aria-owns={open ? 'long-menu' : undefined}

import {
  contactsCreate,
  contactsDelete,
  contactsFetch,
} from 'actions/contacts'

import UserAvatar from 'components/UserAvatar'
import Loader from 'components/Loader'
import { SmallHeader } from 'components/views'

import ContactItem from './ContactItem'
import {
  SmallHeaderHelp,
} from '../Sidebar/views'
import {
  AddContactForm,
  AddContactEndWrapper,
  Root,
  ContactsList,
//   UserAccountPic,
//   UserAccountDetails,
//   UserAccountBalance,
//   UserAccountAddress,
} from './views'

// import {
//   UserInfo,
//   UserPic,
//   UserName,
//   UserUsername,
//   UserOptionsButton,
// } from './views'

export default @connect(
  ({ contacts }) => ({
    ready: !contacts.working && contacts.data !== null,
    contacts: contacts.data && Object.values(contacts.data),
    isFetching: contacts.working === 'fetch',
    isCreating: contacts.working === 'create',
    isDeleting: contacts.working === 'delete',
    error: contacts.error,
  }),
  dispatch => ({
    actions: bindActionCreators({
      contactsFetch,
      contactsCreate,
      contactsDelete,
    }, dispatch),
  }),
)
class UserContacts extends React.PureComponent {
  state = {
    text: '',
    error: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      error: props.error || null,
      // selected: props.selected || null,
    }
  }

  componentWillMount() {
    const { actions, ready } = this.props
    if (!ready) {
      actions.contactsFetch()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { error, selected, isCreating } = this.props
    if (error !== nextProps.error) {
      this.setState({
        error: nextProps.error,
      })
    }
    // if (selected !== nextProps.selected) {
    //   this.setState({
    //     selected: nextProps.selected,
    //   })
    // }
    if (isCreating && !nextProps.isCreating) {
      this.setState({
        text: '',
      })
    }
  }

  errorMessage = () => {
    const { error } = this.props
    if (!error) {
      return null
    }
    switch (error) {
      case 'invalid-username':
        return 'User does not exist'

      case 'contact-exists':
        return 'User already added'

      default:
        return 'An unknown error occurred'
    }
  }

  render() {
    const {
      errorMessage,
      props: {
        modal,
        actions,
        contacts,
        isFetching,
        isCreating,
        onSelect,
        selected,
      },
      state: {
        error,
        text,
      },
    } = this

    if (isFetching) {
      return (
        <Root>
          <Loader size={40} />
        </Root>
      )
    }


    return (
      <Root>
        {!modal && (
          <SmallHeader>
          Contacts
            <SmallHeaderHelp>
            click to bill
            </SmallHeaderHelp>
          </SmallHeader>
        )}
        <ContactsList dense>
          {(contacts || []).map(contact => (
            <ContactItem {...{
              contact,
              modal,
              ...(
                modal
                  ? {
                    selected: selected.username === contact.username,
                    onClick: () => {
                      onSelect(contact)
                    },
                  }
                  : {}
              ),
            }}
            />
          ))
          }
        </ContactsList>
        <AddContactForm>
          <TextField
            style={{
              flexGrow: 1,
            }}
            error={error}
            helperText={error ? errorMessage() : ''}
            value={text}
            id="standard-error"
            defaultValue="Hello World"
            label="Enter username"
            onChange={(e) => {
              this.setState({
                error: null,
                text: e.target.value,
              })
            }}
          />
          <AddContactEndWrapper>
            {isCreating ? (
              <CircularProgress size={32} />
            ) : (
              <IconButton
                color="primary"
                onClick={() => {
                  actions.contactsCreate(text)
                }}
              >
                <AddIcon />
              </IconButton>
            )}
          </AddContactEndWrapper>
        </AddContactForm>
      </Root>
    )
  }
}
