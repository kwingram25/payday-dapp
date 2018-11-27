import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export default ({
  loading, children, disabled, ...props
}) => (
  <Button disabled={loading || disabled} {...props}>
    {loading ? (
      <CircularProgress
        color={props.color === 'primary' ? 'default' : 'primary'}
        size={14}
      />
    ) : children}
  </Button>
)
