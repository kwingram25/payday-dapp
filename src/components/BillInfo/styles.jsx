export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: '150px',
    marginBottom: '52px',
  },
  user: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attributes: {
    fontSize: '19px',
  },
  description: {
    fontSize: '19px',
    color: theme.palette.text.secondary,
    '& > span': {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
  },
  date: {
    fontSize: '15px',
    color: theme.palette.text.secondary,
  },
})
