import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

import { headerHeight } from 'config/styles'

export const AppHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${headerHeight}px;
`

export const SiteLogo = styled(Typography)`
  text-decoration: none !important
  color: #aaa;
`
