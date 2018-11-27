import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//
import Grid from '@material-ui/core/Grid'

import withStyles from '@material-ui/core/styles/withStyles'
import Paper from '@material-ui/core/Paper'

import { userSignOut } from 'actions/auth'

import UserContacts from 'components/UserContacts'

import UserDetails from './UserDetails'

import styles from './styles'

export default
connect(
  null,
  dispatch => ({
    actions: bindActionCreators({
      userSignOut,
    }, dispatch),
  }),
)(
  withStyles(styles)(
    ({ classes }) => (
      <Grid container spacing={16} className={classes.root}>
        <Grid item xs={12} sm={6} md={12}>
          <Paper className={classes.paper} elevation={12}>
            <UserDetails />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <Paper className={classes.paper} elevation={12}>
            <UserContacts />
          </Paper>
        </Grid>
      </Grid>
    ),
  ),
)
