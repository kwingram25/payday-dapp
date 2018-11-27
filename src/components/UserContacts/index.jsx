import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'

import AddIcon from '@material-ui/icons/Add'

import {
  contactsCreate,
  contactsDelete,
  contactsFetch,
} from 'actions/contacts'

import Loader from 'components/Loader'
import SmallHeader from 'components/SmallHeader'

import ContactItem from './ContactItem'

import styles from './styles'

export default
@connect(
  ({ contacts }) => ({
    ready: !contacts.fetching && contacts.data !== null,
    contacts: contacts.data && Object.values(contacts.data),
    isFetching: contacts.fetching,
    isCreating: contacts.creating,
    isDeleting: contacts.deleting,
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
@withStyles(styles)
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
    const { error, isCreating } = this.props
    if (error !== nextProps.error) {
      this.setState({
        error: nextProps.error,
      })
    }

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

      case 'cannot-add-self':
        return 'You can\'t add yourself'

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
        classes,
      },
      state: {
        error,
        text,
      },
    } = this

    if (isFetching) {
      return (
        <div className={classes.root}>
          <Loader size={40} />
        </div>
      )
    }


    return (
      <div className={classes.root}>
        {!modal && (
          <SmallHeader>
            Contacts
          </SmallHeader>
        )}
        {(contacts && contacts.length) ? (
          <List className={classes.list} dense>
            {(contacts || []).map(contact => (
              <ContactItem {...{
                key: contact.username,
                contact,
                modal,
                ...(
                  modal
                    ? {
                      selected: selected === contact.username,
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
          </List>
        ) : (
          <div className={classes.noContacts}>
          No Contacts
          </div>
        )}
        <form
          className={classes.addForm}
          onSubmit={(e) => {
            e.preventDefault()
            actions.contactsCreate(text)
          }}
        >
          <TextField
            style={{
              flexGrow: 1,
            }}
            error={error}
            helperText={error ? errorMessage() : ''}
            value={text}
            label="Enter username"
            onChange={(e) => {
              this.setState({
                error: null,
                text: e.target.value,
              })
            }}
          />
          <div className={classes.addContactEnd}>
            {isCreating ? (
              <CircularProgress size={32} />
            ) : (
              <IconButton
                color="primary"
                type="submit"
              >
                <AddIcon />
              </IconButton>
            )}
          </div>
        </form>
      </div>
    )
  }
}
