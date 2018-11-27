export default theme => ({
  root: {
    backgroundColor: '#700000',
    color: theme.palette.text.primary,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 1.5,
    top: theme.spacing.unit * 1.5,
  },
  message: {
    paddingRight: 50,
  },
})
