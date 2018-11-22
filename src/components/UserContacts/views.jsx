import styled from 'styled-components'
import List from '@material-ui/core/List'

// export const SidebarWrapper = styled.div`
//   width: 300px;
//   min-height: 100vh;
// `

export const contactItemStyles = {
  deleteButton: {
    opacity: 0.2,
    marginRight: '-3px',
    transition: 'all 0.2s ease',
    // color: theme.palette.grey[500],

    '&:hover': {
      opacity: 1,
      // color: theme.palette.common.white
    },
  },
}

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-height: 600px;
`

export const ContactsList = styled(List)`
  flex-grow: 1;
  overflow-y: auto;
`

export const AddContactForm = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0 0;
`

export const AddContactEndWrapper = styled.div`
  width: 48px !important
  display: flex;
  align-items: center;
  justify-content: center;
`

// export const UserOptionsButton = styled(IconButton)`
//   color: #bbb;
// `
//
// export const UserInfo = styled.div`
//   margin: 32px 0 16px;
//   display: flex;
//   align-items: center;
// `
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
