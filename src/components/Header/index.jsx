import React from 'react'
import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// //
// import IconButton from '@material-ui/core/IconButton'
// import PowerIcon from '@material-ui/icons/PowerSettingsNew'
//
// //
// // import AccountCircle from '@material-ui/icons/AccountCircle'
//
//
// import { userSignOut } from 'actions/auth'
//
import {
  AppHeader,
  SiteLogo,
  // SidebarWrapper,
  // SidebarPaper,
  // UserInfo,
  // UserPic,
  // UserName,
  // UserUsername,
} from './views'

// import UserDetails from './UserDetails'
// import UserAccount from './UserAccount'
// import UserContacts from './UserContacts'

export default () => ((
  <AppHeader>
    <SiteLogo
      variant="h4"
      component={Link}
      to="/dashboard"
    >
      PayDay
    </SiteLogo>
  </AppHeader>
))
