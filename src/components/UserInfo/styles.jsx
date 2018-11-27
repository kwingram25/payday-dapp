export default theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  nameInfo: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit * 2,
  },
  name: {
    ...theme.typography.h6,
    lineHeight: 1.2,
    fontSize: '1.2rem',
  },
  username: {
    ...theme.typography.captionNext,
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
})
