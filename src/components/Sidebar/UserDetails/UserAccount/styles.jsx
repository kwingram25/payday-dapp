export default theme => ({
  root: {
    // marginTop: theme.spacing.unit,
    display: 'flex',
    alignItems: 'flex-end',
  },
  icon: {
    marginRight: 2 * theme.spacing.unit,
  },

  info: {
    overflow: 'hidden',
  },

  address: {
    fontFamily: 'monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '15px',
  },
})
