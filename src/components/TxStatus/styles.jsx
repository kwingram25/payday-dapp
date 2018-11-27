export default theme => ({
  root: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.text.primary,
  },
  message: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  progress: {
    marginRight: 2 * theme.spacing.unit,
  },
})
