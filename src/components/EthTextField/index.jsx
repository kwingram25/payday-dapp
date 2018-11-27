import React from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import styles from './styles'

const variants = {
  eth: {
    placeholder: '0',
    step: 0.1,
    symbol: 'ETH',
  },
  gwei: {
    placeholder: '0',
    step: 1,
    symbol: 'GWei',
  },
  limit: {
    placeholder: '0',
    step: 1000,
    symbol: 'Gas',
  },
}

export default
withStyles(styles)(({
  variant = 'eth',
  InputProps = {},
  max = null,
  onChange,
  classes,
  ...props
}) => {
  const {
    placeholder, step, symbol,
  } = variants[variant]

  if (!symbol) {
    return null
  }

  const textFieldProps = {
    type: 'number',
    min: 0,
    placeholder,
    onChange: (e) => {
      const amount = parseFloat(e.target.value, 10)
      const isValid = (
        !isNaN(e.target.value)
          && parseFloat(e.target.value, 10) > 0
      )

      onChange(amount, isValid)
    },
    InputProps: {
      inputProps: {
        min: 0,
        step,
        max,
      },
      endAdornment: (
        <InputAdornment
          className={classes.inputAdornment}
          position="end"
          disableTypography
        >
          {symbol}
        </InputAdornment>
      ),
      ...InputProps,
    },
  }
  return (
    <TextField
      {...textFieldProps}
      {...props}
    />
  )
})
