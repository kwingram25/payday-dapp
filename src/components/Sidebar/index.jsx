import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//
import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'

import PowerIcon from '@material-ui/icons/PowerSettingsNew'

//
// import AccountCircle from '@material-ui/icons/AccountCircle'


import { userSignOut } from 'actions/auth'

import { mdSidebarPanelStyles, smSidebarStyles, xsSidebarStyles, sidebarPanelHeight } from 'config/styles'

import UserContacts from 'components/UserContacts'

import {
  AppLogo,
  SidebarWrapper,
  SidebarPaper,
  // UserInfo,
  // UserPic,
  // UserName,
  // UserUsername,
} from './views'


import UserDetails from './UserDetails'

export default
connect(
  null,
  dispatch => ({
    actions: bindActionCreators({
      userSignOut,
    }, dispatch),
  }),
)(
  withStyles(theme => ({
    root: {
      [theme.breakpoints.between('sm', 'md')]: smSidebarStyles,
      [theme.breakpoints.down('sm')]: xsSidebarStyles,
    },
    grid: {
      height: '100%',
    },
    paper: {
      padding: '12px',
      minHeight: `${sidebarPanelHeight}px`,
      height: '100%',
      [theme.breakpoints.between('sm', 'md')]: {
        height: '100%',
      },
    },
  }))(
    ({ classes }) => (
      <Grid container spacing={24} className={classes.root}>
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
