export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',

  },
  info: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
  },
  stat: {
    width: '50%',
    fontSize: '1rem',
  },
  tooltip: {
    fontSize: '0.75rem',
  },
})
