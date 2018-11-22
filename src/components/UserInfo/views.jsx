import React from 'react'
import styled from 'styled-components'

import Typography from '@material-ui/core/Typography'

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

export const UserNameInfo = styled.div`
  flex-grow: 1;
  margin-left: 12px;
`

export const UserName = ({ children }) => (
  <Typography
    variant="h6"
    style={{
      fontSize: '18px',
      lineHeight: 1.2,
    }}
  >
    {children}
  </Typography>
)

export const UserUsername = ({ children }) => (
  <Typography
    variant="caption"
    style={{
      // fontSize: '18px',
    }}
  >
    {children}
  </Typography>
)
