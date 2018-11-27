import React from 'react'
import ColorHash from 'color-hash'
import styled from 'styled-components'
import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'
import Avatar from '@material-ui/core/Avatar'

import styles from './styles'

const colorHash = new ColorHash({
  saturation: 0.7,
  lightness: 0.4,
  hash: (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i += 1) {
      hash += str.charCodeAt(i)
    }
    return hash
  },
})

export default withStyles(styles)(({
  classes, username, avatarUrl, big, ...rest
}) => {
  const props = {
    className: classNames(
      classes.root,
      big && classes.big,
    ),
    ...rest,
  }

  const StyledAvatar = (avatarUrl || !username) ? Avatar : styled(Avatar)({
    color: 'white !important',
    backgroundColor: `${colorHash.hex(username)} !important`,
  })

  return avatarUrl ? (
    <StyledAvatar {...props} src={avatarUrl} />
  ) : (
    <StyledAvatar {...props}>
      {(username || '?').substring(0, 1).toUpperCase()}
    </StyledAvatar>
  )
})
