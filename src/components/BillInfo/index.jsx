import React from 'react'
import moment from 'moment'

import withStyles from '@material-ui/core/styles/withStyles'

import EthBalance from 'components/EthBalance'
import UserInfo from 'components/UserInfo'

import styles from './styles'

export default withStyles(
  styles,
)(({ bill, contact, classes }) => {
  const {
    date, description, amount, amountRemaining, isOwned, isPaid,
  } = bill
  return (
    <div className={classes.root}>
      <UserInfo user={contact} />
      <div className={classes.attributes}>
        <EthBalance big negative={!isOwned} positive={isOwned}>
          {isPaid ? amount : amountRemaining}
        </EthBalance>
        <div className={classes.description}>
          {'for '}
          <span>
            {description}
          </span>
        </div>
        <div className={classes.date}>
          {moment.unix(date).format('MMM D, YYYY')}
        </div>

      </div>
    </div>
  )
})
