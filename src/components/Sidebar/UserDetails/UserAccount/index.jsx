import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import blockies from 'ethereum-blockies'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import copy from 'copy-to-clipboard'
import download from 'js-file-download'

import { loadUserData } from 'blockstack'

// import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import CopyIcon from '@material-ui/icons/FileCopy'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ExplorerIcon from '@material-ui/icons/ExitToApp'
import QRCodeIcon from '@material-ui/icons/PhoneAndroid'
import PrivateKeyIcon from '@material-ui/icons/Lock'

// import AccountCircle from '@material-ui/icons/AccountCircle'
// import MoreVertIcon from '@material-ui/icons/MoreVert'

// aria-owns={open ? 'long-menu' : undefined}

import { etherscanUrl } from 'providers/Etherscan'

import EthBalance from 'components/EthBalance'
import {
  SmallHeader,
} from 'components/views'
import {
  UserAccountWrapper,
  UserAccountPic,
  UserAccountDetails,
  UserAccountBalance,
  UserAccountAddress,
} from './views'

// import {
//   UserInfo,
//   UserPic,
//   UserName,
//   UserUsername,
//   UserOptionsButton,
// } from './views'

export default
@connect(
  ({ auth, account }) => ({
    user: auth.user,
    address: account.address,
    balance: account.balance,
  }),
)
class UserAccount extends React.PureComponent {
  state = {
    copied: false,
  }

  render() {
    const { user, address, balance } = this.props
    const { copied } = this.state

    return (
      <div>
        <SmallHeader>
          Account
        </SmallHeader>
          <UserAccountWrapper>
            <UserAccountPic
              src={blockies.create({
                seed: address.toLowerCase(),
                size: 8,
                scale: 16,
              })[0].toDataURL()}
            />
            <UserAccountDetails>
              <EthBalance
                big
                quantity={balance}
              />
              <UserAccountAddress>
                {address}
              </UserAccountAddress>
            </UserAccountDetails>
            <PopupState variant="popover" popupId="demoMenu">
              {popupState => (
                <React.Fragment>
                  <IconButton
                    aria-label="More"
                    aria-haspopup="true"
                    {...bindTrigger(popupState)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      onClick={() => {
                        copy(address)
                        this.setState({
                          copied: true,
                        })
                        setTimeout(() => {
                          this.setState({
                            copied: false,
                          })
                        }, 5000)
                      }}
                    >
                      <ListItemIcon>
                        <CopyIcon color={copied ? 'primary' : 'default'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={copied ? 'Copied!' : 'Copy to Clipboard'}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={popupState.close}
                      component="a"
                      href={etherscanUrl(address)}
                      target="_blank"
                    >
                      <ListItemIcon>
                        <ExplorerIcon />
                      </ListItemIcon>
                      <ListItemText primary="View in Explorer" />
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={{
                        pathname: '/qr',
                        state: {
                          modal: true,
                        }
                      }}
                      onClick={() => {
                        popupState.close()
                      }}
                    >
                      <ListItemIcon>
                        <QRCodeIcon />
                      </ListItemIcon>
                      <ListItemText primary="View QR Code" />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        download(loadUserData().appPrivateKey, `${user.username}.txt`)
                        popupState.close()
                      }}
                    >
                      <ListItemIcon>
                        <PrivateKeyIcon />
                      </ListItemIcon>
                      <ListItemText primary="Download Private Key" />
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </UserAccountWrapper>
      </div>
    )
  }
}
