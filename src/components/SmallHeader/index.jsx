import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

export default withStyles(
  theme => ({
    root: {
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing.unit,
    },
  }),
)(({ classes, children }) => (
  <div className={classes.root}>
    {children}
  </div>
))
