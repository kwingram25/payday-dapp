import React from 'react'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import { EthSymbol } from './views'

const variants = {
  eth: {
    placeholder: 0,
    step: 0.1,
    symbol: 'ETH',
  },
  gwei: {
    placeholder: 0,
    step: 1,
    symbol: 'GWei',
  },
  limit: {
    placeholder: 0,
    step: 1000,
    symbol: 'Gas',
  },
}

const EthTextField = ({
  variant = 'eth', onChange, InputProps = {}, ...props
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
      },
      endAdornment: (
        <InputAdornment
          position="end"
          disableTypography
        >
          <EthSymbol>
            {symbol}
          </EthSymbol>
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
}
export default EthTextField
