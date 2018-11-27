import React from 'react'
import { Link } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'

import styles from './styles'

export default withStyles(styles)(
  ({ classes }) => ((
    <div className={classes.appHeader}>
      <Link
        className={classes.logo}
        to="/dashboard"
      >
        PayDay
      </Link>
    </div>
  )),
)
