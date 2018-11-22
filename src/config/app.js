import lightGreen from '@material-ui/core/colors/lightGreen'
import green from '@material-ui/core/colors/green'
import yellow from '@material-ui/core/colors/yellow'
import blueGrey from '@material-ui/core/colors/blueGrey'


export const muiThemeOptions = {
  palette: {
    type: 'dark',
    primary: lightGreen,
  },
  overrides: {
    MUIDataTableHeadCell: {
      fixedHeader: {
        backgroundColor: 'inherit',
      }
    },
    MUIDataTableSelectCell: {
      fixedHeader: {
        backgroundColor: 'inherit',
      },
      checked: {
        color: `lightcoral !important`
      },
    },
    MUIDataTableToolbarSelect: {
      root: {
        backgroundColor: 'inherit',
      },
    },
  },
}

export const gaiaOptions = (options) => ({
  ...options,
  // app: 'payday.blockstack.org',
  zoneFileLookupURL: 'https://core.blockstack.org/v1/names/',
})

export const accountFilePath = 'account.json'
export const contactsFilePath = 'contacts.json'
export const billsFilePath = username => `bills/${username}.json`
