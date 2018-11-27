export default (theme) => {
  const { sidebarPanelHeight } = theme.constants
  const { unit } = theme.spacing
  return {
    root: {
      [theme.breakpoints.between('sm', 'md')]: {
        height: `calc(${sidebarPanelHeight}px + (4 * ${unit}px))`,
      },
      [theme.breakpoints.down('sm')]: {
        width: `calc(100vw - (4 * ${unit}px))`,
      },
    },
    grid: {
      height: '100%',
    },
    paper: {
      padding: 1.5 * unit,
      minHeight: `${sidebarPanelHeight}px`,
      height: '100%',
      [theme.breakpoints.between('sm', 'md')]: {
        height: '100%',
      },
    },
  }
}
