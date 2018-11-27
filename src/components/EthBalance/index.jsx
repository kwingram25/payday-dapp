import React from 'react'
import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'

import styles from './styles'

export default
withStyles(styles)(
  ({
    precision, children, classes, ...props
  }) => {
    const {
      medium, big, positive, negative,
    } = props

    const className = classNames(
      classes.root,
      big && classes.big,
      medium && classes.medium,
      positive && classes.positive,
      negative && classes.negative,
    )

    return (
      <span className={className}>
        {parseFloat(children, 10).toLocaleString(undefined, {
          minimumFractionDigits: precision || 2,
          maximumFractionDigits: precision || 4,
        })}
      </span>
    )
  },
)
