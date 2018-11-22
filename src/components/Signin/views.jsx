import styled from 'styled-components'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

export const SignInWrapper = styled(Paper)`
  margin: 0px auto;
  width: 360px;
  padding: 22px;
`

export const SignInTitle = styled(Typography)`
  && {
    font-size: 22px;
    margin-bottom: 12px;
  }
`

export const SignInText = styled(Typography)`
  && {
    margin-bottom: 32px;
  }
`

export const SignInButton = styled(Button)`
  width: 100%;
`
