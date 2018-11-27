export default theme => ({
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    flexGrow: '1',

    '& > :last-child': {
      marginLeft: theme.spacing.unit * 2,
    },
  },
  toolbar: {
    justifyContent: 'center',
  },
})
