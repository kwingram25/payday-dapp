export const cellStyles = theme => ({
  base: {
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  details: {
    minWidth: '360px',
    width: '65%',
    '& > div': {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  },
  date: {
    width: '65px',
  },
  amount: {
    width: '90px',
  },
  actions: {
    width: '62px',
    paddingRight: `${theme.spacing.unit}px !important`,
  },
})

export default theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tableWrapper: {
    padding: `0 ${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 1.5}px`,
    overflowX: 'auto',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  table: {
    tableLayout: 'fixed',
    minWidth: '580px',
  },
  empty: {
    display: 'flex',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
  addIcon: {
    marginRight: theme.spacing.unit,
  },
})
