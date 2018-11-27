export default (theme) => {
  const { headerHeight, sidebarPanelHeight } = theme.constants
  const { unit } = theme.spacing
  return {
    root: {
      maxWidth: '960px',
      padding: 2 * unit,
      margin: '0px auto',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: '100vh',
      width: `calc(100vw - ${2 * unit}px)`,
    },
    mainPanel: {
      [theme.breakpoints.up('sm')]: {
        minHeight: `calc(100vh - ${headerHeight}px - ${sidebarPanelHeight}px - ${6 * unit}px)`,
        paddingBottom: `${headerHeight}px !important`,
      },
      [theme.breakpoints.up('md')]: {
        minHeight: `calc(100vh - ${headerHeight}px - ${6 * unit}px)`,
        paddingBottom: `${unit}px !important`,
      },
    },
  }
}
