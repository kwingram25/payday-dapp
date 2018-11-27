export default theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: theme.spacing.unit * 8,
    margin: `0 ${theme.spacing.unit * 2}px`,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',

    '& > *': {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      '& > :not(:first-child)': {
        marginLeft: theme.spacing.unit * 2,
      },
    },
  },
  left: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
})
