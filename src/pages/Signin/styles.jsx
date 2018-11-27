export default theme => ({
  root: {
    margin: '0px auto',
    maxWidth: '360px',
    padding: 2 * theme.spacing.unit,
  },
  title: {
    ...theme.typography.h6,
    marginBottom: theme.spacing.unit,
  },
  copy: {
    marginBottom: 4 * theme.spacing.unit,
  },
  button: {
    width: '100%',
  },
})
