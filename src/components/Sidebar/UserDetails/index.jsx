import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import PowerIcon from '@material-ui/icons/PowerSettingsNew'
import withStyles from '@material-ui/core/styles/withStyles'

import { userSignOut, userAccountFetch } from 'actions/auth'


import UserInfo from 'components/UserInfo'
import EthBalance from 'components/EthBalance'
import Loader from 'components/Loader'
import SmallHeader from 'components/SmallHeader'

import UserAccount from './UserAccount'

import styles from './styles'

const cumulativeBalance = filterFn => data => Object.values(data)
  .filter(filterFn)
  .reduce((sum, { amount, amountPaid = 0 }) => sum + (amount - amountPaid), 0)

export default
@connect(
  ({ auth, bills, payments }) => ({
    user: auth.user,
    isReady: auth.user && auth.user.address,
    ...((bills.data && payments.data) ? {
      youOwe: cumulativeBalance(({ isOwned, isClosed }) => !isOwned && !isClosed)(bills.data),
      youAreOwed: cumulativeBalance(({ isOwned, isClosed }) => isOwned && !isClosed)(bills.data),
    } : {}),
  }),
  dispatch => ({
    actions: bindActionCreators({
      userAccountFetch,
      userSignOut,
    }, dispatch),
  }),
)
@withStyles(styles)
class UserDetails extends React.Component {
  componentWillMount() {
    const { actions, isReady } = this.props
    if (!isReady) {
      actions.userAccountFetch()
    }
  }

  render() {
    const {
      classes, isReady, user, actions, youOwe = 0, youAreOwed = 0,
    } = this.props
    if (!isReady) {
      return (
        <div className={classes.root}>
          <Loader size={40} />
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div>
          <SmallHeader>
        Logged In As
          </SmallHeader>
          <UserInfo
            user={user}
            accessory={(
              <Tooltip
                title="Sign Out"
                placement="bottom"
                enterDelay={300}
                classes={{
                  tooltip: classes.tooltip,
                }}
              >
                <IconButton
                  color="secondary"
                  aria-label="More"
                  aria-haspopup="true"
                  onClick={() => {
                    actions.userSignOut()
                  }}
                >
                  <PowerIcon />
                </IconButton>
              </Tooltip>
            )}
          />
        </div>
        <div className={classes.stats}>
          <div className={classes.stat}>
            <SmallHeader>
          You Owe
            </SmallHeader>
            <EthBalance medium negative>
              {youOwe}
            </EthBalance>
          </div>
          <div className={classes.stat}>
            <SmallHeader>
          You Are Owed
            </SmallHeader>
            <EthBalance medium positive>
              {youAreOwed}
            </EthBalance>
          </div>
        </div>
        <UserAccount />
      </div>
    )
  }
}
