export default theme => ({
  baseRow: {
    cursor: 'pointer',
    height: '60px',
  },
  archivedRow: {
    opacity: 0.5,
  },
  description: {
    marginLeft: theme.spacing.unit * 1.5,
    flexGrow: 1,
  },
  amountPaid: {
    color: theme.balance.neutral,
    float: 'right',
    whiteSpace: 'nowrap',
  },
})
