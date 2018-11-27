export default theme => ({
  appHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: theme.constants.headerHeight,
  },

  logo: {
    ...theme.typography.h4,
    textDecoration: 'none',
    color: theme.balance.positive,
    fontFamily: '"Nova Mono", sans-serif',
  },
})
