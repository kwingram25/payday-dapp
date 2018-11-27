export default {
  root: {
    backgroundColor: '#313131',
    marginBottom: '12px !important',
  },
  details: {
    padding: '8px 12px',
  },
  tableWrapper: {
    overflowX: 'auto',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  table: {
    tableLayout: 'fixed',
    minWidth: '520px',
  },
  cell: {
    paddingLeft: '12px',
    paddingRight: '12px',
    borderBottom: 'none',
  },
  date: {
    width: '160px',
  },
  amount: {
    width: '110px',
  },
  txHash: {

  },
  txHashInner: {
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontFamily: 'monospace',
    fontSize: '15px',
  },
  actions: {
    width: '74px',
    paddingRight: '12px !important',
  },
  explorerButton: {
    opacity: 0.2,
    transition: 'all 0.2s ease',

    '&:hover': {
      opacity: 1,
    },
  },
}
