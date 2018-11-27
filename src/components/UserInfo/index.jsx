import React from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import UserAvatar from 'components/UserAvatar'

import styles from './styles'

// import {
//   UserInfo,
//   UserNameInfo,
//   UserName,
//   UserUsername,
// } from './views'

export default withStyles(styles)(
  ({
    user, accessory, classes, ...rest
  }) => {
    const { name, username, avatarUrl } = user
    return (
      <div className={classes.root} {...rest}>
        <UserAvatar {...{
          avatarUrl,
          username,
        }}
        />
        <div className={classes.nameInfo}>
          <div className={classes.name}>
            {name || '<no name>'}
          </div>
          <div className={classes.username}>
            {username}
          </div>
        </div>
        {!!accessory && accessory}
      </div>
    )
  },
)
