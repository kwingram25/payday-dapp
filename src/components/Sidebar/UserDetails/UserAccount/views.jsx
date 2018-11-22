import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
// import IconButton from '@material-ui/core/IconButton'

// export const SidebarWrapper = styled.div`
//   width: 300px;
//   min-height: 100vh;
// `

export const UserAccountPic = styled(Avatar)`
  margin-right: 12px;
`

// export const UserOptionsButton = styled(IconButton)`
//   color: #bbb;
// `
//

export const UserAccountDetails = styled.div`
  overflow: hidden;
`

export const UserAccountWrapper = styled.div`
  margin: 8px 0;
  display: flex;
  align-items: flex-end;
`

export const UserAccountAddress = styled.div`
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
`
//
// export const UserName = styled.div`
//   font-size: 18px;
//   font-weight: bold;
// `
//
// export const UserUsername = styled.div`
//   color: #bbb;
//   font-size: 12px;
// `
