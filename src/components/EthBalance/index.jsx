import React from 'react'
import styled from 'styled-components'

import Typography from '@material-ui/core/Typography'

const colors = {
  neutral: '#EEE',
  positive: '#9aff26',
  negative: '#f35e01',
}

export default
({
  quantity = 0,
  precision,
  variant = 'neutral',
  big = false,
  component = 'div',
  style = {},
}) => {
  const Component = styled(component)({
    color: `${colors[variant]} !important`,
    fontWeight: 500,
    fontSize: `${big ? '22px' : '15px'}`,
    ...style,
    '&:after': {
      fontWeight: 200,
      opacity: 0.8,
      display: 'inline',
      content: '" ETH"',
    },
  })

  return (
    <Component variant="h6">
      {quantity.toLocaleString(undefined, {
        minimumFractionDigits: precision || 2,
        maximumFractionDigits: precision || 8,
      })}
    </Component>
  )
}
