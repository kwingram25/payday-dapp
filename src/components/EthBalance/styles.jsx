export default theme => ({
  root: {
    ...theme.typography.h6,
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: '0.95rem',
    lineHeight: 1,
    whiteSpace: 'nowrap',

    '&:after': {
      fontWeight: 200,
      opacity: 0.8,
      display: 'inline',
      content: '" ETH"',
    },
  },
  positive: {
    color: theme.balance.positive,
  },
  negative: {
    color: theme.balance.negative,
  },
  medium: {
    fontSize: '1.4rem',
  },
  big: {
    fontSize: '2rem',
  },
})
