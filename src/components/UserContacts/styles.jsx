export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    height: '100%',
    maxHeight: '600px',
  },
  help: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  list: {
    flexGrow: '1',
    overflowY: 'auto',
  },
  noContacts: {
    ...theme.typography.h6,
    flexGrow: '1',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addForm: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
  },
  addFormEnd: {
    width: `${theme.spacing.unit * 6}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
