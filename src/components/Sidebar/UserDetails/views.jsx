import React from 'react'
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

// export const SidebarWrapper = styled.div`
//   width: 300px;
//   min-height: 100vh;
// `

export const UserDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: center;
  height: 100%;
`

export const UserOptionsButton = styled(IconButton)`
  color: #bbb;
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

export const UserStats = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
`

export const UserStat = styled.div`
  width: 50%;
  font-size: 22px;
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

// export const UserUsername = styled.div`
//   color: #bbb;
//   font-size: 12px;
// `
