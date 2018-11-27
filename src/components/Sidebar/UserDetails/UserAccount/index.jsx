import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import copy from 'copy-to-clipboard'
import download from 'js-file-download'
import { createIcon } from '@download/blockies'

import withStyles from '@material-ui/core/styles/withStyles'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import CopyIcon from '@material-ui/icons/FileCopy'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import QRCodeIcon from '@material-ui/icons/PhoneAndroid'
import PrivateKeyIcon from '@material-ui/icons/Lock'

import User from 'models/User'

import Etherscan from 'providers/etherscan'

import { userAccountBalanceFetch } from 'actions/auth'

import EthBalance from 'components/EthBalance'
import SmallHeader from 'components/SmallHeader'

import styles from './styles'

export default
@connect(
  ({ auth }) => ({
    username: auth.user.username,
    address: auth.user.address,
    balance: auth.user.balance,
  }),
  dispatch => ({
    actions: bindActionCreators({
      userAccountBalanceFetch,
    }, dispatch),
  }),
)
@withStyles(styles)
class UserAccount extends React.PureComponent {
  state = {
    copied: false,
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const {
      classes, username, address, balance,
    } = this.props
    const { copied } = this.state

    return (
      <div>
        <SmallHeader>
          Account
        </SmallHeader>
        <div className={classes.root}>
          <Avatar
            className={classes.icon}
            src={createIcon({
              seed: address.toLowerCase(),
              size: 8,
              scale: 16,
            }).toDataURL()}
          />
          <div className={classes.info}>
            <EthBalance medium precision={3}>
              {balance}
            </EthBalance>
            <div className={classes.address}>
              {address}
            </div>
          </div>
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
                      <CopyIcon color={copied ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={copied ? 'Copied!' : 'Copy to Clipboard'}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href={Etherscan.addressUrl(address)}
                    target="_blank"
                  >
                    <ListItemIcon>
                      <OpenInNewIcon />
                    </ListItemIcon>
                    <ListItemText primary="View in Explorer" />
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={{
                      pathname: '/qr',
                      state: {
                        modal: true,
                      },
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
                      download(User.privateKey, `${username}.txt`)
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
        </div>
      </div>
    )
  }
}
