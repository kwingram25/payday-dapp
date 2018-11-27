export default (theme) => {
  const { unit } = theme.spacing

  return {
    root: {
      position: 'relative',
      padding: '96px 12px 62px',
      minHeight: '390px',
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'flex-start',
    },
    title: {
      ...theme.typography.h6,
      flexGrow: 1,
    },
    user: {
      width: '100%',
      display: 'block !important',
      textAlign: 'center',
      flexBasis: '200px',
    },
    name: {
      ...theme.typography.h6,
      marginTop: 2 * unit,
    },
    username: {
      color: theme.palette.text.secondary,
      fontSize: '0.875rem',
      marginBottom: unit * 4,
    },
    attributes: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    attribute: {
      minHeight: '92px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    date: {
      fontSize: '1rem',
      color: theme.palette.text.secondary,
    },
    amountOriginal: {
      fontSize: '1rem',
      color: theme.palette.text.secondary,
    },
    amountRemaining: {
      display: 'inline-flex',
    },
    status: {
      marginLeft: 2 * unit,
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',

      '& > :not(:first-child)': {
        marginLeft: '3px',
      },
    },
    statusIcon: {
      fontSize: '15px',
    },
    paid: {
      color: `${theme.balance.positive}`,
    },
    unpaid: {
      color: `${theme.balance.neutral}`,
    },
    description: {
      ...theme.typography.h6,
      lineHeight: 1,
      marginBottom: unit,
    },
    errorText: {
      color: theme.palette.error.main,
      fontSize: '13px',
      marginTop: '12px',
    },
    contactSelect: {
      minWidth: '320px',
      minHeight: '400px',
    },
    contactSelectContent: {
      display: 'flex',
      flexDirection: 'column',
    },
  }
}
