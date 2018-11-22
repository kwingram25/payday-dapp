import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import { Container } from './views'

export default ({ size }) => ((
  <Container>
    <CircularProgress size={size} />
  </Container>
))
