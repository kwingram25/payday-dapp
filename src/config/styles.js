import lightGreen from '@material-ui/core/colors/lightGreen'

export const positiveColor = '#9aff26'
export const negativeColor = '#f35e01'

export const muiThemeOptions = {
  palette: {
    type: 'dark',
    primary: lightGreen,
  },
  balance: {
    positive: positiveColor,
    negative: negativeColor,
    neutral: 'yellow',
  },
  constants: {
    headerHeight: 72,
    sidebarPanelHeight: 270,
  },
}
