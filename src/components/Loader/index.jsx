import React from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

import styles from './styles'

export default withStyles(styles)(
  ({ size, classes }) => (
    <div className={classes.root}>
      <CircularProgress size={size} />
    </div>
  ),
)
