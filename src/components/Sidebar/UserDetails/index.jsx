import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Button from '@material-ui/core/Button'
import PowerIcon from '@material-ui/icons/PowerSettingsNew'
import { withStyles } from '@material-ui/core/styles'

// aria-owns={open ? 'long-menu' : undefined}

import { userSignOut } from 'actions/auth'
import { userAccountFetch } from 'actions/account'

import { mdSidebarPanelStyles } from 'config/styles'

import UserAvatar from 'components/UserAvatar'
import EthBalance from 'components/EthBalance'
import Loader from 'components/Loader'

import {
  SmallHeader,
} from 'components/views'
import UserAccount from './UserAccount'

import {
  UserDetailsWrapper,
  UserInfo,
  UserPic,
  UserNameInfo,
  UserName,
  UserUsername,
  UserOptionsButton,
  UserStats,
  UserStat,
} from './views'

const cumulativeBalance = filterFn => data => Object.values(data)
  .filter(filterFn)
  .reduce((sum, { amount, amountPaid = 0 }) => sum + (amount - amountPaid), 0)

export default
@connect(
  ({ auth, account, bills }) => ({
    ready: !account.working && (account.address !== null && account.balance !== null),
    user: auth.user,
    ...(bills.data ? {
      youOwe: cumulativeBalance(({ isOwned, isPaid }) => !isOwned && !isPaid)(bills.data),
      youAreOwed: cumulativeBalance(({ isOwned, isPaid }) => isOwned && !isPaid)(bills.data),
    } : {}),
  }),
  dispatch => ({
    actions: bindActionCreators({
      userAccountFetch,
      userSignOut,
    }, dispatch),
  }),
)
class UserDetails extends React.Component {
  componentWillMount() {
    const { actions, ready } = this.props
    if (!ready) {
      actions.userAccountFetch()
    }
  }

  render() {
    const {
      ready, user, actions, youOwe = 0, youAreOwed = 0,
    } = this.props
    if (!ready) {
      return (
        <UserDetailsWrapper>
          <Loader size={40} />
        </UserDetailsWrapper>
      )
    }
    const { username, name, avatarUrl } = user || {}
    return (
      <UserDetailsWrapper>
        <SmallHeader>
        Logged In As
        </SmallHeader>
        <UserInfo>
          <UserAvatar {...{
            avatarUrl,
            username,
          }}
          />
          <UserNameInfo>
            <UserName>
              {name || '<no name>'}
            </UserName>
            <UserUsername>
              {username}
            </UserUsername>
          </UserNameInfo>
          <UserOptionsButton
            color="secondary"
            aria-label="More"
            aria-haspopup="true"
            onClick={() => {
              actions.userSignOut()
            }}
          >
            <PowerIcon />
          </UserOptionsButton>
        </UserInfo>
        <UserStats>
          <UserStat>
            <SmallHeader>
          You Owe
            </SmallHeader>
            <EthBalance
              big
              variant="negative"
              quantity={youOwe}
              style={{
                marginTop: '8px',
              }}
            />
          </UserStat>
          <UserStat>
            <SmallHeader>
          You Are Owed
            </SmallHeader>
            <EthBalance
              big
              variant="positive"
              quantity={youAreOwed}
              style={{
                marginTop: '8px',
              }}
            />
          </UserStat>
        </UserStats>
        <UserAccount />
      </UserDetailsWrapper>
    )
  }
}
